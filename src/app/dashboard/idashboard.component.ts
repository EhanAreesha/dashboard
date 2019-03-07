
interface CourseCompletionData {
    label?:string;
    value?:number;
}

interface CandidateRatingsData {
    label?:string;
    value?:number;
}

interface MostSubscribedData {
    label?:string;
    value?:number;
}

interface IData {
    bycourseData?: CourseCompletionData[];
    bytrackData?: CourseCompletionData[];
    bycourseRatingsData?: CandidateRatingsData[];
    bytrackRatingsData?: CandidateRatingsData[];
    bycourseSubscribedData?: MostSubscribedData[];
    bytrackSubscribedData?: MostSubscribedData[];
    tempcsData?: any[];
    temptsData?: any[];
    tempttcData?: any[];
    temptttData?: any[];
    tempatcData?: any[];
    tempattData?: any[];
    csvg?: any;
    cwidth?: any;
    cheight?: any;
    cradius?: any;
    tsvg?: any;
    twidth?: any;
    theight?: any;
    tradius?: any;
    crsvg?: any;
    crwidth?: any;
    crheight?: any;
    crradius?: any;
    trsvg?: any;
    trwidth?: any;
    trheight?: any;
    trradius?: any;
}


interface CourseSatisficationData {
    title?: string;
    minScore?: number;
    maxScore?: number;
    avgScore?: number;
    candidates?:CandidateSatisficationData[];
}

interface CandidateSatisficationData {
    candidateId?:string;
    ratingScore?:number;
}

interface TimeTakenData {
    title?:string;
    candidates?:CandidatesTime[];
}

interface CandidatesTime {
    candidateId?:string;
    candidateName?:string;
    completionTime?:string;
}

interface AggregatedTimeData {
    courses?:AggregatedCourseTime[];
}

interface AggregatedCourseTime {
    courseId?:string;
    courseName?:string;
    aggregatedTime?:string;
}