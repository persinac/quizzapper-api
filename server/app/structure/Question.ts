interface IQuestion {
    questionID?: number;
    question: string;
    testTopic: string;
    style: string;
    category: string;
    subCategory: string;
    correctAnswer: string;
    answers: string;
    difficulty: string;
    softwareVersion?: string;
    documentation: string;
    helperTextOne: string;
    helperTextTwo: string;
    createdBy: string;
    createdDatetime: Date;
    modifiedBy: string;
    modifiedDatetime: Date;
    isActive: number;
}

export default IQuestion;