import { FileText, Download, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PDFNotesProps {
  notesUrl: string | null;
  moduleTitle: string;
  isViewed: boolean;
  onView: () => void;
}

const PDFNotes = ({ notesUrl, moduleTitle, isViewed, onView }: PDFNotesProps) => {
  const handleView = () => {
    if (notesUrl) {
      window.open(notesUrl, '_blank');
      onView();
    }
  };

  const handleDownload = () => {
    if (notesUrl) {
      const link = document.createElement('a');
      link.href = notesUrl;
      link.download = `${moduleTitle}-notes.pdf`;
      link.click();
      onView();
    }
  };

  if (!notesUrl) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="py-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No PDF notes available for this module</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(isViewed && 'border-primary/20 bg-primary/5')}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'h-12 w-12 rounded-lg flex items-center justify-center',
              isViewed ? 'bg-primary/20' : 'bg-muted'
            )}>
              <FileText className={cn('h-6 w-6', isViewed ? 'text-primary' : 'text-muted-foreground')} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Module Notes
                {isViewed && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </CardTitle>
              <CardDescription>{moduleTitle}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleView} className="flex-1 sm:flex-none">
            <ExternalLink className="h-4 w-4 mr-2" />
            View PDF
          </Button>
          <Button variant="outline" onClick={handleDownload} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
        {!isViewed && (
          <p className="text-sm text-muted-foreground mt-3">
            View the notes to mark this section as complete
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFNotes;
