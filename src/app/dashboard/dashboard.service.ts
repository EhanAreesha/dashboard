import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class DashboardService {

    _course_completion_by_course = "./../../assets/data/mock-course-completion-data-by-course.json"
    _course_completion_by_track = "./../../assets/data/mock-course-completion-data-by-track.json"
    _candidate_ratings_by_course = "./../../assets/data/mock-candidate-ratings-data-by-course.json"
    _candidate_ratings_by_track = "./../../assets/data/mock-candidate-ratings-data-by-track.json"
    _most_subscribed_by_course = "./../../assets/data/mock-most-subscribed-data-by-course.json"
    _most_subscribed_by_track = "./../../assets/data/mock-most-subscribed-data-by-track.json"
    _candidate_satisfication_by_course = "./../../assets/data/mock-candidate-satisfaction-data-by-course.json"
    _candidate_satisfication_by_track = "./../../assets/data/mock-candidate-satisfaction-data-by-track.json"
    _time_taken_by_course = "./../../assets/data/mock-time-taken-data-by-course.json"
    _time_taken_by_track = "./../../assets/data/mock-time-taken-data-by-track.json"
    _aggregated_time_by_course = "./../../assets/data/mock-aggregated-time-data-by-course.json"
    _aggregated_time_by_track = "./../../assets/data/mock-aggregated-time-data-by-track.json"

    constructor(private http: HttpClient) {}

    getCourseCompletionDataByCourse(): Observable<CourseCompletionData[]> {
        return this.http.get<CourseCompletionData[]>(this._course_completion_by_course);
    }
    getCourseCompletionDataByTrack(): Observable<CourseCompletionData[]> {
        return this.http.get<CourseCompletionData[]>(this._course_completion_by_track);
    }
    getCandidateRatingsByCourse(): Observable<CandidateRatingsData[]> {
        return this.http.get<CandidateRatingsData[]>(this._candidate_ratings_by_course);
    }
    getCandidateRatingsByTrack(): Observable<CandidateRatingsData[]> {
        return this.http.get<CandidateRatingsData[]>(this._candidate_ratings_by_track);
    }
    getMostSubscribedByCourse(): Observable<MostSubscribedData[]> {
        return this.http.get<MostSubscribedData[]>(this._most_subscribed_by_course);
    }
    getMostSubscribedByTrack(): Observable<MostSubscribedData[]> {
        return this.http.get<MostSubscribedData[]>(this._most_subscribed_by_track);
    }
    getCandidateSatisficationDataByCourse(): Observable<CourseSatisficationData[]> {
        return this.http.get<CourseSatisficationData[]>(this._candidate_satisfication_by_course);
    }
    getCandidateSatisficationDataByTrack(): Observable<CourseSatisficationData[]> {
        return this.http.get<CourseSatisficationData[]>(this._candidate_satisfication_by_track);
    }
    getTimeByCourse(): Observable<TimeTakenData[]> {
        return this.http.get<TimeTakenData[]>(this._time_taken_by_course);
    }
    getTimeByTrack(): Observable<TimeTakenData[]> {
        return this.http.get<TimeTakenData[]>(this._time_taken_by_track);
    }
    getAggregatedTimeByCourse(): Observable<AggregatedTimeData[]> {
        return this.http.get<AggregatedTimeData[]>(this._aggregated_time_by_course);
    }
    getAggregatedTimeByTrack(): Observable<AggregatedTimeData[]> {
        return this.http.get<AggregatedTimeData[]>(this._aggregated_time_by_track);
    }
}