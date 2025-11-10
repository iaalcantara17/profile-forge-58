import { useToast } from "@/hooks/use-toast";
import { exportService } from "@/lib/exportService";

export const useExport = () => {
  const { toast } = useToast();

  const exportResumeToPDF = async (resumeData: any, filename?: string) => {
    try {
      await exportService.exportResumeToPDF(resumeData, filename);
      toast({ title: "Resume exported to PDF" });
    } catch (error) {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const exportResumeToText = async (resumeData: any, filename?: string) => {
    try {
      exportService.downloadResumeAsText(resumeData, filename);
      toast({ title: "Resume exported to text" });
    } catch (error) {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const exportCoverLetterToPDF = async (content: string, title: string, filename?: string) => {
    try {
      await exportService.exportCoverLetterToPDF(content, title, filename);
      toast({ title: "Cover letter exported to PDF" });
    } catch (error) {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const exportCoverLetterToText = async (content: string, filename?: string) => {
    try {
      exportService.downloadCoverLetterAsText({ content }, filename);
      toast({ title: "Cover letter exported to text" });
    } catch (error) {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  const exportStatisticsToCSV = async (stats: any, filename?: string) => {
    try {
      await exportService.exportStatisticsToCSV(stats, filename);
      toast({ title: "Statistics exported to CSV" });
    } catch (error) {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  return {
    exportResumeToPDF,
    exportResumeToText,
    exportCoverLetterToPDF,
    exportCoverLetterToText,
    exportStatisticsToCSV,
  };
};
