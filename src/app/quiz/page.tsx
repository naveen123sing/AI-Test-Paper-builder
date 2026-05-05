'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../Components/Header';
import UploadArea from '../Components/UploadArea';
import QuizResults from '../Components/QuizResult';
import { useGenerateQuiz } from '@/app/services/QuizServive';
import { getFriendlyErrorMessage } from '@/app/services/errorHandler';
import DifficultySelector from '../Components/DifficultySelector';
import QuestionType, { QuestionTypeValue } from '../Components/QuestionType';
import { SparklesIcon } from '../Components/Icon';
import DescriptivePaper from '../Components/DescriptivePaper';


interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  answer?: string;
  explanation?: string;
  unit?: string;
  topic?: string;
  difficulty?: string;
  type?: string;
}

interface ApiQuestion {
  type?: string;
  difficulty?: string;
  unit?: string;
  topic?: string;
  question: string;
  options?:
  | {
    A: string;
    B: string;
    C: string;
    D: string;
  }
  | string[];
  answer?: string;
  correctAnswer?: number;
  explanation?: string;
}

interface ApiQuizResponse {
  filename?: string;
  semester?: string;
  branch?: string;
  subject_code?: string;
  subject_name?: string;
  questions?: ApiQuestion[];
}

export default function QuizPage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [paperTitle, setPaperTitle] = useState('');
  const [branch, setBranch] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quizVersion, setQuizVersion] = useState(0);
  const [questionCount, setQuestionCount] = useState(20);
  const [showDescriptivePreview, setShowDescriptivePreview] = useState(false);
  const { mutate, isPending } = useGenerateQuiz();
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionTypeValue[]>(['Descriptive']);
  const [difficulty, setDifficulty] = useState({
    easy: 40,
    medium: 40,
    hard: 20,
  });

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (!user) {
      router.push('/');
    }
  }, [router]);

  const resetQuiz = () => {
    setQuestions([]);
    setPaperTitle('');
    setBranch('');
    setSubjectName('');
    setSubjectCode('');
    setShowDescriptivePreview(false);
  };

  const formatQuestions = (data: ApiQuizResponse): Question[] => {
    return (data?.questions ?? []).map((q: ApiQuestion, index: number) => {
      if (!q.options) {
        return {
          id: index + 1,
          question: q.question,
          options: [],
          correctAnswer: -1,
          answer: q.answer ?? '',
          explanation: q.explanation ?? '',
          unit: q.unit,
          topic: q.topic,
          difficulty: q.difficulty,
          type: q.type,
        };
      }

      if (!Array.isArray(q.options)) {
        const optionsObj = q.options as {
          A: string;
          B: string;
          C: string;
          D: string;
        };

        const optionsArray = [
          optionsObj.A,
          optionsObj.B,
          optionsObj.C,
          optionsObj.D,
        ];

        const correctAnswerIndex = q.answer
          ? ['A', 'B', 'C', 'D'].indexOf(q.answer)
          : -1;

        return {
          id: index + 1,
          question: q.question,
          options: optionsArray,
          correctAnswer: correctAnswerIndex,
          answer: correctAnswerIndex >= 0 ? optionsArray[correctAnswerIndex] : q.answer ?? '',
          explanation: q.explanation ?? '',
          unit: q.unit,
          topic: q.topic,
          difficulty: q.difficulty,
          type: q.type,
        };
      }

      return {
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer ?? -1,
        answer:
          q.correctAnswer !== undefined && q.correctAnswer >= 0 && q.options[q.correctAnswer]
            ? q.options[q.correctAnswer]
            : q.answer ?? '',
        explanation: q.explanation ?? '',
        unit: q.unit,
        topic: q.topic,
        difficulty: q.difficulty,
        type: q.type,
      };
    });
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setError(null);
    resetQuiz();
  };

  const generateQuestions = (file: File) => {
    setLoading(true);
    setError(null);
    resetQuiz();
    mutate(
      {
        file,
        questionCount,
        difficulty,
        questionTypes: selectedQuestionTypes,
      },
      {
        onSuccess: (data) => {
          setQuizVersion((prev) => prev + 1);
          setQuestions(formatQuestions(data));
          setPaperTitle(data?.semester ?? '');
          setBranch(data?.branch ?? '');
          setSubjectName(data?.subject_name ?? '');
          setSubjectCode(data?.subject_code ?? '');
          setShowDescriptivePreview(selectedQuestionTypes.includes('Descriptive'));
        },
        onError: (err: unknown) => {
          setError(getFriendlyErrorMessage(err));
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  const handleGenerate = () => {
    if (!uploadedFile) {
      alert('Please upload a syllabus first');
      return;
    }

    generateQuestions(uploadedFile);
  };

  const handleRegenerate = () => {
    if (!uploadedFile) {
      alert('Please upload file first');
      return;
    }

    generateQuestions(uploadedFile);
  };

  const handleDownload = () => {
    const quizText = questions
      .map((q) => {
        if (q.options.length === 0) {
          return `${q.id}. ${q.question}\n\n`;
        }

        return `${q.id}. ${q.question}\n${q.options
          .map((opt, idx) => `   ${String.fromCharCode(65 + idx)}. ${opt}`)
          .join('\n')}\n   Correct Answer: ${String.fromCharCode(
            65 + q.correctAnswer
          )}\n`;
      })
      .join('\n');

    const blob = new Blob([quizText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-quiz-questions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

   const total = difficulty.easy + difficulty.medium + difficulty.hard;
   const isValidTotal = total === 100;
   const isDescriptiveSelected = selectedQuestionTypes.includes('Descriptive');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">
            Create Smarter <span style={{ color: '#4F46E5' }}>Assessments</span>{' '}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Upload your syllabus and let Test Series Builder handle the cognitvie heavy lifiting.
            Generate tailored questions in second.
          </p>
        </div>

        <UploadArea
          onFileLoaded={handleFileUpload}
          error={error}
          loading={loading}
        />

        <DifficultySelector
          difficulty={difficulty}
          onChange={setDifficulty}
          questionCount={questionCount}
          onQuestionCountChange={setQuestionCount}
        />

        <QuestionType
          selectedTypes={selectedQuestionTypes}
          onChange={setSelectedQuestionTypes}
        />

        <button
          onClick={handleGenerate}
          disabled={!uploadedFile || !isValidTotal || selectedQuestionTypes.length === 0 || loading || isPending}
          className="w-full mt-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
        >
          {(loading || isPending) ? (
            <>
              Generating Questions...
            </>
          ) : (
            <>
              <SparklesIcon className="w-6 h-6" />
              Generate Questions with AI
            </>
          )}
        </button>


        {(loading || isPending) && (
          <div className="mt-6 flex justify-center">
            <div className="bg-amber-100 shadow-md rounded-xl px-6 py-4 flex items-center gap-4">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-700 text-sm font-medium">
                Generating quiz, please wait...
              </p>
            </div>
          </div>
        )}

        {showDescriptivePreview && isDescriptiveSelected && (
          <DescriptivePaper
            questions={questions}
            courseName={paperTitle}
            branch={branch}
            subjectName={subjectName}
            subjectCode={subjectCode}
          />
        )}

        {questions.length > 0 && !isDescriptiveSelected && (
          <QuizResults
            key={quizVersion}
            questions={questions}
            onRegenerate={handleRegenerate}
            onDownload={handleDownload}
          />
        )}
      </main>
    </div>
  );
}
