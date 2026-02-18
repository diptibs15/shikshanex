 import { Link } from "react-router-dom";
 import Navbar from "@/components/layout/Navbar";
 import Footer from "@/components/layout/Footer";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
   Users,
   Briefcase,
   DollarSign,
   CheckCircle2,
   ArrowRight,
   Wallet,
   Target,
   TrendingUp,
   Calendar,
   Award,
   GraduationCap,
 } from "lucide-react";
 
 const whoCanJoin = [
   "Fresh Graduates",
   "MBA / BBA Students",
   "Non-IT Background",
   "Career Switchers",
   "Anyone interested in HR",
 ];
 
 const hrModules = [
   { title: "Recruitment Life Cycle", description: "End-to-end hiring process management" },
   { title: "Interview Coordination", description: "Scheduling, conducting & feedback collection" },
   { title: "Offer & Onboarding", description: "Offer letters, joining formalities & induction" },
   { title: "Payroll Processing", description: "Salary structure, deductions & disbursement" },
   { title: "PF, ESI & Compliance", description: "Statutory compliance and documentation" },
   { title: "HR Software Basics", description: "HRIS, ATS & payroll software training" },
 ];
 
 const internshipTasks = [
   {
     title: "Task 1: Software Developer Hiring",
     target: "2 Joinings",
     payout: "₹1,000 per hiring",
     description: "Recruit and onboard software developers for partner companies",
   },
   {
     title: "Task 2: Intern Hiring",
     target: "10 Interns",
     payout: "₹500 per intern",
     description: "Source and recruit interns for various departments",
   },
   {
     title: "Task 3: Team Handling",
     target: "Lead team to hire 10 Developers",
     payout: "₹1,000 × 10 = ₹10,000/month",
     description: "Manage a team of HR interns and guide them in recruitment",
   },
 ];
 
 const HRTrainingPage = () => {
   return (
     <div className="min-h-screen bg-background">
       <Navbar />
       <main>
         {/* Hero */}
         <section className="gradient-hero text-primary-foreground py-16 lg:py-24">
           <div className="container">
             <div className="max-w-3xl mx-auto text-center">
               <Badge className="bg-white/10 text-white mb-4">Most Popular Program</Badge>
               <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                 HR Training Program
               </h1>
               <p className="text-lg text-white/80 mb-8">
                 Comprehensive HR training with live internship tasks and earning opportunities.
                 Earn while you learn with our unique wallet-based stipend system.
               </p>
               <div className="flex flex-wrap justify-center gap-6">
                 <div className="text-center">
                   <div className="text-4xl font-heading font-bold">₹5,999</div>
                   <div className="text-sm text-white/70">Course Fee</div>
                 </div>
                 <div className="w-px bg-white/20" />
                 <div className="text-center">
                   <div className="text-4xl font-heading font-bold">3-6</div>
                   <div className="text-sm text-white/70">Months Duration</div>
                 </div>
                 <div className="w-px bg-white/20" />
                 <div className="text-center">
                   <div className="text-4xl font-heading font-bold">₹20K</div>
                   <div className="text-sm text-white/70">Earning Potential</div>
                 </div>
               </div>
               <div className="mt-8">
                 <Link to="/apply">
                   <Button variant="accent" size="xl" className="group">
                     Enroll Now
                     <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                   </Button>
                 </Link>
               </div>
             </div>
           </div>
         </section>
 
         {/* Who Can Join */}
         <section className="py-16 lg:py-20">
           <div className="container">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
               <div>
                 <span className="text-primary font-semibold text-sm uppercase tracking-wider">Eligibility</span>
                 <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                   Who Can Join?
                 </h2>
                 <div className="space-y-4">
                   {whoCanJoin.map((item) => (
                     <div key={item} className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5 text-healthcare flex-shrink-0" />
                       <span className="text-foreground">{item}</span>
                     </div>
                   ))}
                 </div>
               </div>
               
               <div className="bg-card rounded-2xl border shadow-card p-8">
                 <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                   <GraduationCap className="h-6 w-6 text-primary" />
                   HR Modules Covered
                 </h3>
                 <div className="space-y-4">
                   {hrModules.map((module, idx) => (
                     <div key={idx} className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                         {idx + 1}
                       </div>
                       <div>
                         <h4 className="font-semibold text-foreground">{module.title}</h4>
                         <p className="text-sm text-muted-foreground">{module.description}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>
         </section>
 
         {/* Live Task System */}
         <section className="py-16 lg:py-20 bg-muted/30">
           <div className="container">
             <div className="text-center max-w-2xl mx-auto mb-12">
               <Badge className="bg-healthcare/10 text-healthcare mb-4">🔥 Earn While You Learn</Badge>
               <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
                 HR Internship – Live Task System
               </h2>
               <p className="text-muted-foreground">
                 Complete real hiring tasks and earn money directly to your wallet. Like Rapido/Uber earnings model!
               </p>
             </div>
             
             <div className="grid md:grid-cols-3 gap-6 mb-12">
               {internshipTasks.map((task, idx) => (
                 <Card key={idx} className="shadow-card hover:shadow-card-hover transition-all">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-lg">
                       <Target className="h-5 w-5 text-primary" />
                       {task.title}
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <p className="text-sm text-muted-foreground">{task.description}</p>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2 text-sm">
                         <Target className="h-4 w-4 text-muted-foreground" />
                         <span>Target: <strong>{task.target}</strong></span>
                       </div>
                       <div className="flex items-center gap-2 text-sm text-healthcare font-semibold">
                         <DollarSign className="h-4 w-4" />
                         <span>{task.payout}</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
 
             {/* Earnings Model */}
             <div className="bg-gradient-to-r from-hr to-hr/80 rounded-2xl p-8 lg:p-12 text-white">
               <div className="grid lg:grid-cols-2 gap-8 items-center">
                 <div>
                   <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
                     <Wallet className="h-7 w-7" />
                     HR Internship Earnings Model
                   </h3>
                   <div className="space-y-4">
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5" />
                       <span>Monthly Stipend Potential: ₹10,000 – ₹20,000</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5" />
                       <span>Internship Duration: 2 Months</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5" />
                       <span>Total Possible Earnings: ₹20,000+</span>
                     </div>
                   </div>
                 </div>
                 <div className="bg-white/10 rounded-xl p-6">
                   <h4 className="font-semibold mb-4 flex items-center gap-2">
                     <Wallet className="h-5 w-5" />
                     Wallet System (Like Rapido / Uber)
                   </h4>
                   <ul className="space-y-3 text-sm text-white/90">
                     <li className="flex items-start gap-2">
                       <CheckCircle2 className="h-4 w-4 mt-0.5" />
                       Earnings credited to in-app wallet
                     </li>
                     <li className="flex items-start gap-2">
                       <CheckCircle2 className="h-4 w-4 mt-0.5" />
                       Withdrawal available every month on 5th
                     </li>
                     <li className="flex items-start gap-2">
                       <CheckCircle2 className="h-4 w-4 mt-0.5" />
                       Track: Earnings, Completed Tasks, Withdraw History
                     </li>
                   </ul>
                 </div>
               </div>
             </div>
           </div>
         </section>
 
         {/* CTA */}
         <section className="py-16 lg:py-20">
           <div className="container">
             <div className="bg-card rounded-2xl border shadow-card p-8 lg:p-12 text-center">
               <Award className="h-16 w-16 mx-auto text-primary mb-6" />
               <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                 Start Your HR Career Today
               </h2>
               <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                 Join 1000+ students who have transformed their careers with our HR training program. 
                 Get certified, gain real experience, and earn while you learn!
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Link to="/apply">
                   <Button variant="hero" size="xl">Enroll Now - ₹5,999</Button>
                 </Link>
                 <Link to="/contact">
                   <Button variant="outline" size="xl">Talk to Counselor</Button>
                 </Link>
               </div>
             </div>
           </div>
         </section>
       </main>
       <Footer />
     </div>
   );
 };
 
 export default HRTrainingPage;