export const mockExams = [
  {
    id: "ex_1",
    title: "General Anatomy & Physiology",
    category: "MBBS",
    durationMinutes: 30,
    totalQuestions: 20,
    active: true,
  },
  {
    id: "ex_2",
    title: "Pharmacology Basics",
    category: "Pharmacy",
    durationMinutes: 45,
    totalQuestions: 30,
    active: true,
  },
  {
    id: "ex_3",
    title: "Fundamentals of Nursing",
    category: "Nursing",
    durationMinutes: 60,
    totalQuestions: 50,
    active: true,
  },
  {
    id: "ex_4",
    title: "Emergency Paramedic Procedures",
    category: "Paramedical",
    durationMinutes: 40,
    totalQuestions: 25,
    active: true,
  },
];

export const mockQuestions: Record<string, any[]> = {
  ex_1: [
    {
      id: "q_1",
      text: "Which of the following is the largest organ in the human body?",
      options: ["Heart", "Liver", "Skin", "Brain"],
      correctAnswer: 2, // Index of 'Skin'
    },
    {
      id: "q_2",
      text: "What is the primary function of red blood cells?",
      options: ["Fight infection", "Carry oxygen", "Clot blood", "Produce antibodies"],
      correctAnswer: 1,
    },
    {
      id: "q_3",
      text: "Which part of the brain controls balance and coordination?",
      options: ["Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"],
      correctAnswer: 1,
    },
  ],
};
