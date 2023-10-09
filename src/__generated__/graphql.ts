/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
};

export type Class = {
  __typename?: 'Class';
  classNumber: Scalars['Int']['output'];
  classSection: Scalars['String']['output'];
  combinedSectionId?: Maybe<Scalars['String']['output']>;
  component?: Maybe<Scalars['String']['output']>;
  course: Course;
  enrollmentCap?: Maybe<Scalars['Int']['output']>;
  enrollmentTotal?: Maybe<Scalars['Int']['output']>;
  equivalents?: Maybe<Scalars['String']['output']>;
  hours: Scalars['Float']['output'];
  instructionType?: Maybe<Scalars['String']['output']>;
  lastUpdatedAt: Scalars['DateTime']['output'];
  lastUpdatedFrom: Scalars['String']['output'];
  meetingDates?: Maybe<Scalars['String']['output']>;
  minEnrollment?: Maybe<Scalars['Int']['output']>;
  schedules: Array<ClassSchedule>;
  term: Scalars['String']['output'];
  title: Scalars['String']['output'];
  topics?: Maybe<Scalars['String']['output']>;
  waitlistCap?: Maybe<Scalars['Int']['output']>;
  waitlistTotal?: Maybe<Scalars['Int']['output']>;
};

export type ClassSchedule = {
  __typename?: 'ClassSchedule';
  days: Scalars['String']['output'];
  endTime: Scalars['Int']['output'];
  instructors: Array<Instructor>;
  location: Scalars['String']['output'];
  startTime: Scalars['Int']['output'];
};

export type Course = {
  __typename?: 'Course';
  attrs: Array<CourseAttribute>;
  code: Scalars['String']['output'];
  credits: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  lastUpdatedAt: Scalars['DateTime']['output'];
  lastUpdatedFrom: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CourseAttribute = {
  __typename?: 'CourseAttribute';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Instructor = {
  __typename?: 'Instructor';
  id: Scalars['Int']['output'];
  instructorType: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  classes: Array<Class>;
};


export type QueryClassesArgs = {
  attrs?: InputMaybe<Array<Scalars['String']['input']>>;
  classNumbers?: InputMaybe<Array<Scalars['Int']['input']>>;
  classSection?: InputMaybe<Scalars['String']['input']>;
  component?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['String']['input']>;
  days?: InputMaybe<Array<Scalars['String']['input']>>;
  endsBefore?: InputMaybe<Scalars['String']['input']>;
  instructionType?: InputMaybe<Scalars['String']['input']>;
  instructor?: InputMaybe<Scalars['String']['input']>;
  startsAfter?: InputMaybe<Scalars['String']['input']>;
  term: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GetClassSchedulesQueryVariables = Exact<{
  class_numbers: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  term: Scalars['String']['input'];
}>;


export type GetClassSchedulesQuery = { __typename?: 'Query', classes: Array<{ __typename?: 'Class', classNumber: number, schedules: Array<{ __typename?: 'ClassSchedule', days: string, startTime: number, endTime: number }> }> };

export type GetScheduleDisplayClassesQueryVariables = Exact<{
  class_numbers: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  term: Scalars['String']['input'];
}>;


export type GetScheduleDisplayClassesQuery = { __typename?: 'Query', classes: Array<{ __typename?: 'Class', classNumber: number, classSection: string, title: string, hours: number, course: { __typename?: 'Course', code: string }, schedules: Array<{ __typename?: 'ClassSchedule', location: string, days: string, startTime: number, endTime: number, instructors: Array<{ __typename?: 'Instructor', name: string }> }> }> };

export type GetClassesQueryVariables = Exact<{
  term: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type GetClassesQuery = { __typename?: 'Query', classes: Array<{ __typename?: 'Class', term: string, classNumber: number, classSection: string, title: string, enrollmentTotal?: number | null, enrollmentCap?: number | null, hours: number, lastUpdatedAt: any, course: { __typename?: 'Course', code: string, description?: string | null }, schedules: Array<{ __typename?: 'ClassSchedule', location: string, days: string, startTime: number, endTime: number, instructors: Array<{ __typename?: 'Instructor', name: string }> }> }> };


export const GetClassSchedulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClassSchedules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"class_numbers"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"term"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"classNumbers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"class_numbers"}}},{"kind":"Argument","name":{"kind":"Name","value":"term"},"value":{"kind":"Variable","name":{"kind":"Name","value":"term"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"schedules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}}]}}]}}]} as unknown as DocumentNode<GetClassSchedulesQuery, GetClassSchedulesQueryVariables>;
export const GetScheduleDisplayClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetScheduleDisplayClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"class_numbers"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"term"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"classNumbers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"class_numbers"}}},{"kind":"Argument","name":{"kind":"Name","value":"term"},"value":{"kind":"Variable","name":{"kind":"Name","value":"term"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classSection"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"schedules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"instructors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}}]}}]} as unknown as DocumentNode<GetScheduleDisplayClassesQuery, GetScheduleDisplayClassesQueryVariables>;
export const GetClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"term"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"term"},"value":{"kind":"Variable","name":{"kind":"Name","value":"term"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"classNumber"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"classSection"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"schedules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"instructors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentTotal"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentCap"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedAt"}}]}}]}}]} as unknown as DocumentNode<GetClassesQuery, GetClassesQueryVariables>;