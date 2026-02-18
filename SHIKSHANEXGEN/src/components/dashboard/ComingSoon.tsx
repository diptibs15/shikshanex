import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">{title}</h2>
        <p className="text-muted-foreground">{description || 'This feature is coming soon'}</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-12 text-center">
          <Construction className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working hard to bring you this feature. Check back soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
