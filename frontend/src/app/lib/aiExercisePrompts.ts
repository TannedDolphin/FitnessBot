export type ExerciseAIAction =
  | "ask"
  | "explain"
  | "muscles"
  | "mistakes";

export function buildExerciseAIPrompt(
  exerciseName: string,
  action: ExerciseAIAction,
): string {
  const name = exerciseName.trim() || "exercise";

  switch (action) {
    case "ask":
      return `
Bạn là AI Fitness Coach.

Chủ đề: workout exercise ${name}

Hãy trả lời bằng tiếng Việt rõ ràng và dễ hiểu.

Nội dung cần có:
- Cách tập đúng
- Các nhóm cơ tác động
- Lỗi sai thường gặp
- Mẹo cải thiện kỹ thuật
`;

    case "explain":
      return `
Bạn là AI Fitness Coach.

Workout exercise: ${name}

Hãy giải thích:
- Tư thế chuẩn
- Kỹ thuật thực hiện
- Nhịp thở
- Tempo
- Lưu ý an toàn
- Cách tập đúng cho người mới
`;

    case "muscles":
      return `
Bạn là AI Fitness Coach.

Gym workout exercise: ${name}

Hãy phân tích:
- Nhóm cơ chính
- Nhóm cơ phụ
- Vai trò từng nhóm cơ
- Bài tập này phù hợp mục tiêu gì
`;

    case "mistakes":
      return `
Bạn là AI Fitness Coach.

Fitness workout: ${name}

Hãy liệt kê:
- Các lỗi sai phổ biến
- Nguyên nhân
- Cách sửa
- Cách tránh chấn thương
`;

    default:
      return `
Bạn là AI Fitness Coach.

Workout exercise: ${name}

Hãy giải thích cách tập đúng và các lưu ý quan trọng.
`;
  }
}