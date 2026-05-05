'use client';

type Difficulty = {
  easy: number;
  medium: number;
  hard: number;
};

type Props = {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  questionCount: number;
  onQuestionCountChange: (questionCount: number) => void;
};

export default function DifficultySelector({
  difficulty,
  onChange,
  questionCount,
  onQuestionCountChange,
}: Props) {
  const total = difficulty.easy + difficulty.medium + difficulty.hard;
  const isValid = total === 100;

  const handleSliderChange = (level: keyof Difficulty, value: number) => {
    const newDifficulty = { ...difficulty, [level]: value };
    onChange(newDifficulty);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">2</div>
            <h2 className="text-xl text-gray-900">Select Difficulty Distribution</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="question-count" className="text-sm text-gray-700">
            Number of Questions
          </label>
          <input
            id="question-count"
            type="number"
            min="1"
            max="100"
            value={questionCount}
            onChange={(e) =>
              onQuestionCountChange(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Easy */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-base text-gray-700">Easy Questions</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={difficulty.easy}
                onChange={(e) => handleSliderChange('easy', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-base text-gray-600">%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={difficulty.easy}
            onChange={(e) => handleSliderChange('easy', parseInt(e.target.value))}
            className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        {/* Medium */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-base text-gray-700">Medium Questions</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={difficulty.medium}
                onChange={(e) => handleSliderChange('medium', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <span className="text-base text-gray-600">%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={difficulty.medium}
            onChange={(e) => handleSliderChange('medium', parseInt(e.target.value))}
            className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        {/* Hard */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-base text-gray-700">Hard Questions</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={difficulty.hard}
                onChange={(e) => handleSliderChange('hard', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <span className="text-base text-gray-600">%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={difficulty.hard}
            onChange={(e) => handleSliderChange('hard', parseInt(e.target.value))}
            className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>
      </div>
      {
        !isValid && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-sm text-orange-700">
              Total must equal 100%. Current total: {total}%
            </p>
          </div>
        )
      }
    </div>
  );
}
