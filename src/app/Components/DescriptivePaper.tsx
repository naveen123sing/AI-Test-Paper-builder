'use client';

import Image from 'next/image';
import compuLogo from '../Assests/compulogo.png';
import { DownloadIcon } from './Icon';

type PaperQuestion = {
  id: number;
  question: string;
};

type Props = {
  questions?: PaperQuestion[];
  courseName?: string;
  branch?: string;
  subjectName?: string;
  subjectCode?: string;
};

const sectionNames = ['A', 'B', 'C'];
const paperDetails = {
  instituteName: 'COMPUCOM INSTITUTE OF TECHNOLOGY & MANAGEMENT',
  subjectCode: 'Examination Paper',
  courseName: 'Descriptive Paper',
  duration: '3 Hours',
  maxMarks: '100',
};

export default function DescriptivePaper({ questions = [], courseName, branch, subjectName, subjectCode }: Props) {
  const paperQuestions = questions;
  const sectionSize = Math.ceil(paperQuestions.length / sectionNames.length);
  const handleDownloadPaper = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
      <div className="mb-5 flex justify-end print:hidden">
        <button
          onClick={handleDownloadPaper}
          className="px-5 py-2.5 rounded-lg text-white transition-all flex items-center gap-2 hover:opacity-90"
          style={{ backgroundColor: '#4F46E5' }}
        >
          <DownloadIcon className="w-4 h-4" />
          Download Paper
        </button>
      </div>
      <div id="printable-paper" className="mx-auto max-w-4xl border border-gray-300 bg-white text-gray-950 shadow-sm">
        <div className="p-8">
          <div className="flex items-center justify-between border-b-2 border-gray-900 pb-2">
            <div className="flex items-center gap-4">
              <div className="h-20 flex items-center justify-center overflow-hidden bg-white">
                <Image
                  src={compuLogo}
                  alt="Institute logo"
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div> 
                <h3 className="text-xl font-semibold uppercase tracking-normal">
                  {paperDetails.instituteName} 
                </h3>
                <p className="text-sm text-gray-600">
                  {subjectCode || paperDetails.subjectCode}
                </p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p><span className="font-semibold">Time:</span> {paperDetails.duration}</p>
              <p><span className="font-semibold">Max Marks:</span> {paperDetails.maxMarks}</p>
            </div>
          </div>

          <div className="py-5 text-center border-b border-gray-300">
            <h4 className="text-xl font-semibold mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span>{courseName || paperDetails.courseName}</span>
              {branch && (
                <>
                  <span className="text-gray-400">|</span>
                  <span>{branch}</span>
                </>
              )}
            </h4>
            {subjectName && (
              <p className="text-base text-gray-700 mt-2">{subjectName}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm py-4 border-b border-gray-300">
            <span>Attempt all sections.</span>
            <span>Write answers clearly with proper question numbers.</span>
          </div>

          <div className="space-y-8 pt-6">
            {paperQuestions.length === 0 ? (
              <p className="text-center text-sm text-gray-500">No questions available</p>
            ) : sectionNames.map((sectionName, sectionIndex) => {
              const start = sectionIndex * sectionSize;
              const sectionQuestions = paperQuestions.slice(start, start + sectionSize);

              if (sectionQuestions.length === 0) {
                return null;
              }

              return (
                <section key={sectionName}>
                  <div className="flex items-center justify-center mb-4 mt-3">
                    <h5 className="px-6 py-2 border border-gray-900 text-base font-semibold">
                      Section {sectionName}
                    </h5>
                  </div>
                  <div className="space-y-5">
                    {sectionQuestions.map((question, index) => (
                      <div key={question.id} className="grid grid-cols-[40px_1fr_70px] gap-3 text-sm leading-6">
                        <span className="font-semibold">Q{start + index + 1}.</span>
                        <p>{question.question}</p>
                        <span className="text-right font-semibold">[{sectionIndex === 0 ? 5 : sectionIndex === 1 ? 10 : 20}]</span>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
