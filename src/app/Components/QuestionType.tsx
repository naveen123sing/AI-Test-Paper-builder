'use client';

import { CheckIcon } from "./Icon";

export type QuestionTypeValue = 'mcq' | 'Short' | 'Descriptive';

type Props = {
    selectedTypes: QuestionTypeValue[];
    onChange: (selectedTypes: QuestionTypeValue[]) => void;
};

export default function QuestionType({ selectedTypes, onChange }: Props) {
    const toggleQuestionType = (type: QuestionTypeValue) => {
        if (selectedTypes.includes(type)) {
            onChange(selectedTypes.filter(t => t !== type));
        } else {
            onChange([...selectedTypes, type]);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">3</div>
                    <h2 className="text-xl text-gray-900">Select Question Types</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => toggleQuestionType('mcq')}
                        className={`p-6 border-2 rounded-2xl transition-all ${selectedTypes.includes('mcq')
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base text-gray-900">Multiple Choice</h3>
                            {selectedTypes.includes('mcq') && (
                                <CheckIcon className="w-5 h-5 text-blue-600" />
                            )}
                        </div>
                        <p className="text-sm text-gray-600 text-left">MCQ questions with 4 options</p>
                    </button>

                    <button
                        onClick={() => toggleQuestionType('Short')}
                        className={`p-6 border-2 rounded-2xl transition-all ${selectedTypes.includes('Short')
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base text-gray-900">Short Answer</h3>
                            {selectedTypes.includes('Short') && (
                                <CheckIcon className="w-5 h-5 text-purple-600" />
                            )}
                        </div>
                        <p className="text-sm text-gray-600 text-left">Open-ended questions</p>
                    </button>

                    <button
                        onClick={() => toggleQuestionType('Descriptive')}
                        className={`p-6 border-2 rounded-2xl transition-all ${selectedTypes.includes('Descriptive')
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base text-gray-900">Descriptive  Answer</h3>
                            {selectedTypes.includes('Descriptive') && (
                                <CheckIcon className="w-5 h-5 text-pink-600" />
                            )}
                        </div>
                        <p className="text-sm text-gray-600 text-left">Open-ended questions</p>
                    </button>
                </div>
            </div>

            
        </>

    )

}
