import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TextField, 
  Button, 
  Chip, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExamResults = ({ exam, onBack }) => {
  // Sample results data aligned with exams.json
  const sampleResults = Array.from({ length: exam.studentsCompleted }, (_, i) => ({
    id: `res${i + 1}`,
    studentName: `Student ${i + 1}`,
    score: exam.id === 'exam1' ? Math.floor(Math.random() * (exam.totalMarks + 1)) : null,
    totalMarks: exam.totalMarks,
    submissionDate: exam.id === 'exam1' ? `2025-05-10T14:${30 + i}:00` : null,
    submitted: exam.id === 'exam1',
    answers: exam.questions.map((q, qIndex) => {
      if (q.type === 'multiple-choice') {
        return {
          question: q.text,
          studentAnswer: q.options[i % q.options.length],
          correctAnswer: q.options[0], // Assume first option is correct for demo
          correct: i % q.options.length === 0
        };
      } else if (q.type === 'true-false') {
        return {
          question: q.text,
          studentAnswer: i % 2 === 0 ? 'True' : 'False',
          correctAnswer: 'False', // Assume 'False' is correct for demo
          correct: (i % 2 === 0) === false
        };
      } else {
        return {
          question: q.text,
          studentAnswer: `Sample answer for question ${qIndex + 1}`,
          correctAnswer: null, // No correct answer for constructive
          correct: null
        };
      }
    })
  }));

  const [results, setResults] = useState(sampleResults);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openAnalysisDialog, setOpenAnalysisDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const passThreshold = exam.totalMarks * 0.5;
  const completedStudents = results.filter(r => r.submitted).length;
  const averageScore = results
    .filter(r => r.submitted && r.score != null)
    .reduce((sum, r) => sum + r.score, 0) / (completedStudents || 1);
  const highestScore = Math.max(...results
    .filter(r => r.submitted && r.score != null)
    .map(r => r.score), 0);
  const lowestScore = Math.min(...results
    .filter(r => r.submitted && r.score != null)
    .map(r => r.score), Infinity) || 0;
  const passRate = (results.filter(r => r.submitted && r.score >= passThreshold).length / (completedStudents || 1)) * 100;

  // Score distribution for bar chart
  const scoreBins = [
    { range: '0-25%', min: 0, max: exam.totalMarks * 0.25, count: 0 },
    { range: '26-50%', min: exam.totalMarks * 0.25, max: exam.totalMarks * 0.5, count: 0 },
    { range: '51-75%', min: exam.totalMarks * 0.5, max: exam.totalMarks * 0.75, count: 0 },
    { range: '76-100%', min: exam.totalMarks * 0.75, max: exam.totalMarks, count: 0 },
  ];
  results.forEach(r => {
    if (r.submitted && r.score != null) {
      const bin = scoreBins.find(b => r.score >= b.min && r.score <= b.max);
      if (bin) bin.count++;
    }
  });

  const chartData = {
    labels: scoreBins.map(b => b.range),
    datasets: [
      {
        label: 'Number of Students',
        data: scoreBins.map(b => b.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Mock difficult questions analysis
  const difficultQuestions = exam.questions.map((q, index) => {
    const correctCount = results.filter(r => r.answers[index]?.correct).length;
    const correctPercentage = (correctCount / (completedStudents || 1)) * 100;
    return {
      question: q.text,
      type: q.type,
      correctPercentage: correctPercentage.toFixed(2)
    };
  });

  const filteredResults = results.filter(res => {
    const matchesSearch = res.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || 
      (gradeFilter === 'pass' && res.score >= passThreshold) || 
      (gradeFilter === 'fail' && res.score < passThreshold);
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'submitted' && res.submitted) || 
      (statusFilter === 'not-submitted' && !res.submitted);
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleDownloadCSV = () => {
    const headers = ['Student Name', 'Grade', 'Submission Date', 'Submission Status'];
    const rows = filteredResults.map(r => [
      r.studentName,
      r.score != null ? `${r.score}/${exam.totalMarks}` : 'N/A',
      r.submissionDate ? new Date(r.submissionDate).toLocaleString() : 'N/A',
      r.submitted ? 'Submitted' : 'Not Submitted',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${exam.name}_results.csv`;
    link.click();
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold', 
          color: '#1976d2',
          textAlign: 'center' 
        }}
      >
        Results for {exam.name}
      </Typography>
      <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Exam Summary
        </Typography>
        <Typography variant="body1">
          <strong>Students Taken:</strong> {completedStudents}
        </Typography>
        <Typography variant="body1">
          <strong>Average Score:</strong> {averageScore.toFixed(2)} / {exam.totalMarks}
        </Typography>
        <Typography variant="body1">
          <strong>Highest Score:</strong> {highestScore} / {exam.totalMarks}
        </Typography>
        <Typography variant="body1">
          <strong>Lowest Score:</strong> {lowestScore === Infinity ? 'N/A' : `${lowestScore} / ${exam.totalMarks}`}
        </Typography>
        <Typography variant="body1">
          <strong>Pass Rate:</strong> {passRate.toFixed(2)}%
        </Typography>
      </Box>
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search by Student Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          sx={{ flex: 1, minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Grade Filter</InputLabel>
          <Select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            label="Grade Filter"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pass">Pass (≥50%)</MenuItem>
            <MenuItem value="fail">Fail (&lt;50%)</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="submitted">Submitted</MenuItem>
            <MenuItem value="not-submitted">Not Submitted</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleDownloadCSV}
          sx={{ 
            backgroundColor: '#1976d2', 
            '&:hover': { backgroundColor: '#1565c0' },
            py: 1,
            px: 3
          }}
        >
          Download CSV
        </Button>
      </Box>
      <Table sx={{ mb: 4, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Submission Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Analysis</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredResults.map((result) => (
            <TableRow key={result.id}>
              <TableCell>{result.studentName}</TableCell>
              <TableCell>
                <Typography 
                  sx={{ 
                    color: result.score >= passThreshold ? '#4CAF50' : '#d32f2f' 
                  }}
                >
                  {result.score != null ? `${result.score}/${exam.totalMarks}` : 'N/A'}
                </Typography>
              </TableCell>
              <TableCell>
                {result.submissionDate 
                  ? new Date(result.submissionDate).toLocaleString() 
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <Chip 
                  label={result.submitted ? 'Submitted' : 'Not Submitted'} 
                  color={result.submitted ? 'success' : 'error'} 
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedStudent(result);
                    setOpenAnalysisDialog(true);
                  }}
                  sx={{ 
                    backgroundColor: '#1976d2', 
                    '&:hover': { backgroundColor: '#1565c0' },
                    py: 0.5,
                    px: 2
                  }}
                >
                  View Analysis
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Analytics
        </Typography>
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Score Distribution
          </Typography>
          <Bar 
            data={chartData} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Score Distribution' },
              },
            }}
          />
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Most Difficult Questions
        </Typography>
        {difficultQuestions.length > 0 ? (
          difficultQuestions.map((q, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              Q{index + 1}: {q.question} ({q.type}) - {q.correctPercentage}% correct
            </Typography>
          ))
        ) : (
          <Typography variant="body2" sx={{ mb: 2 }}>
            No questions available. Add questions to the exam to analyze difficulty.
          </Typography>
        )}
        <Typography variant="subtitle1">
          Completion Statistic
        </Typography>
        <Typography variant="body2">
          {completedStudents} out of {results.length} students completed the exam.
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          onClick={onBack}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            py: 1.5,
            px: 4
          }}
        >
          Back
        </Button>
      </Box>
      <Dialog open={openAnalysisDialog} onClose={() => setOpenAnalysisDialog(false)}>
        <DialogTitle>Performance Analysis for {selectedStudent?.studentName}</DialogTitle>
        <DialogContent>
          <Typography>
            Score: {selectedStudent?.score != null 
              ? `${selectedStudent.score}/${exam.totalMarks}` 
              : 'N/A'}
          </Typography>
          <Typography>
            Status: {selectedStudent?.submitted ? 'Submitted' : 'Not Submitted'}
          </Typography>
          <Typography>
            Submission Date: {selectedStudent?.submissionDate 
              ? new Date(selectedStudent.submissionDate).toLocaleString() 
              : 'N/A'}
          </Typography>
          {selectedStudent?.answers?.length > 0 ? (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Question Analysis
              </Typography>
              {selectedStudent.answers.map((answer, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Q{index + 1}: {answer.question}
                  </Typography>
                  <Typography variant="body2">
                    Student Answer: {answer.studentAnswer}
                  </Typography>
                  {exam.questions[index].type !== 'constructive' ? (
                    <>
                      <Typography variant="body2">
                        Correct Answer: {answer.correctAnswer}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: answer.correct ? '#4CAF50' : '#d32f2f' }}
                      >
                        {answer.correct ? 'Correct' : 'Incorrect'}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      (Open-ended question; manual grading required)
                    </Typography>
                  )}
                </Box>
              ))}
            </>
          ) : (
            <Typography sx={{ mt: 2 }}>
              No question analysis available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenAnalysisDialog(false)} 
            sx={{ 
              backgroundColor: '#1976d2', 
              color: 'white',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamResults;