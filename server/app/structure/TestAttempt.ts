export interface ITestAttempt {
    testAttemptID?: number;
    testLevel: string;
    testTopic?: string;
    numberOfQuestions: number;
    timeLimit: number;
    showHelperText: number;
    showDocumentation: number;
    startDatetime?: Date;
    endDatetime?: Date;
    userSubmitted?: number;
    createdBy: string;
    createdDatetime: Date;
    modifiedBy: string;
    modifiedDatetime: Date;
    isActive: number;
}