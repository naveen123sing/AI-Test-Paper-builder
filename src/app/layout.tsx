import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from './Provider';

export const metadata: Metadata = {
  title: "Create Smarter Assessments",
  description: "Upload your syllabus and let Test Series Builder handle the cognitvie heavy lifiting. Generate tailored questions in second.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}