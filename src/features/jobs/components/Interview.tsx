// components/InterviewQuestions.tsx
import React, { useState } from 'react';
import { jobApi } from '../api/job.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb, Users, Target, Brain, Star } from 'lucide-react';

interface InterviewQuestionsProps {
  applicationId: string;
  jobTitle: string;
  candidateName: string;
}

interface QuestionsData {
  technicalQuestions: string[];
  behavioralQuestions: string[];
  situationalQuestions: string[];
  skillGapQuestions: string[];
  cultureQuestions: string[];
}

export const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({
  applicationId,
  jobTitle,
  candidateName,
}) => {
  const [questions, setQuestions] = useState<QuestionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobApi.generateInterviewQuestions(applicationId);
      setQuestions(response.data.questions);
    } catch (err) {
      setError('Failed to generate interview questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const QuestionSection: React.FC<{
    title: string;
    questions: string[];
    icon: React.ReactNode;
    color: string;
  }> = ({ title, questions, icon, color }) => {
    if (!questions || questions.length === 0) return null;

    return (
      <Card>
        <CardHeader className={`pb-3 ${color}`}>
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="secondary" className="ml-auto">
              {questions.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {questions.map((question, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span className="flex-1">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Interview Questions</h3>
          <p className="text-sm text-muted-foreground">
            Get personalized interview questions for {candidateName}
          </p>
        </div>
        <Button
          onClick={fetchQuestions}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="h-4 w-4" />
          )}
          {loading ? 'Generating...' : 'Get Suggestions'}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {questions && (
        <div className="space-y-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Job:</span> {jobTitle}
                </div>
                <div>
                  <span className="font-medium">Candidate:</span> {candidateName}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <QuestionSection
              title="Technical Questions"
              questions={questions.technicalQuestions}
              icon={<Brain className="h-4 w-4" />}
              color="text-blue-600"
            />
            
            <QuestionSection
              title="Behavioral Questions"
              questions={questions.behavioralQuestions}
              icon={<Users className="h-4 w-4" />}
              color="text-green-600"
            />
            
            <QuestionSection
              title="Situational Questions"
              questions={questions.situationalQuestions}
              icon={<Target className="h-4 w-4" />}
              color="text-purple-600"
            />
            
            <QuestionSection
              title="Skill Gap Questions"
              questions={questions.skillGapQuestions}
              icon={<Star className="h-4 w-4" />}
              color="text-amber-600"
            />
            
            <QuestionSection
              title="Culture Fit Questions"
              questions={questions.cultureQuestions}
              icon={<Users className="h-4 w-4" />}
              color="text-indigo-600"
            />
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                <p>
                  <strong>Pro Tip:</strong> These questions are AI-generated based on the job requirements and candidate profile. 
                  Use them as a starting point for your interview preparation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};