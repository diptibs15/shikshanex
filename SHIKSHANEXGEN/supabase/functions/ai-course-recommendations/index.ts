import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInterests, qualification, experience } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch available courses from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: courses, error } = await supabase
      .from("courses")
      .select(`
        id, title, description, duration, price, eligibility, tools_covered,
        course_categories(name)
      `)
      .eq("is_active", true);

    if (error) throw error;

    const coursesContext = courses?.map(c => {
      const categoryData = c.course_categories as unknown;
      const categoryName = categoryData && typeof categoryData === 'object' && 'name' in categoryData 
        ? (categoryData as { name: string }).name 
        : "General";
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        category: categoryName,
        duration: c.duration,
        price: c.price,
        eligibility: c.eligibility,
        tools: (c.tools_covered as string[] | null)?.join(", ") || ""
      };
    });

    const systemPrompt = `You are an AI career counselor for Shiksha Nex Technologies, an ed-tech platform offering courses in IT, HR, Digital Marketing, Graphic Design, and Nursing.

Your task is to recommend the most suitable courses based on the user's profile. Be helpful, encouraging, and provide personalized recommendations.

Available courses:
${JSON.stringify(coursesContext, null, 2)}

Rules:
1. Recommend 2-3 courses that best match the user's interests and qualifications
2. Explain why each course is suitable for them
3. Mention career opportunities after completing the course
4. Be encouraging but realistic about prerequisites
5. Keep responses concise and actionable`;

    const userMessage = `User Profile:
- Interests: ${userInterests || "Not specified"}
- Qualification: ${qualification || "Not specified"}
- Experience: ${experience || "Fresher/Student"}

Please recommend suitable courses for this user.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_courses",
              description: "Return personalized course recommendations",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        courseId: { type: "string" },
                        courseTitle: { type: "string" },
                        matchScore: { type: "number", minimum: 0, maximum: 100 },
                        reason: { type: "string" },
                        careerPaths: {
                          type: "array",
                          items: { type: "string" }
                        }
                      },
                      required: ["courseId", "courseTitle", "matchScore", "reason", "careerPaths"]
                    }
                  },
                  overallAdvice: { type: "string" }
                },
                required: ["recommendations", "overallAdvice"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "recommend_courses" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get AI recommendations");
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const recommendations = JSON.parse(toolCall.function.arguments);
      return new Response(
        JSON.stringify({ success: true, data: recommendations }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback if no tool call
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          recommendations: [],
          overallAdvice: aiResponse.choices?.[0]?.message?.content || "Please explore our courses to find the best fit for you."
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in ai-course-recommendations:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
