import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Form,
  Badge, Alert, Spinner
} from 'react-bootstrap';
import {
  BarChart3, Download, Filter, Calendar, Users,
  TrendingUp, Award, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const EvaluationReports = () => {
  const [reports, setReports] = useState({
    overview: {
      totalEvaluations: 0,
      completedEvaluations: 0,
      pendingEvaluations: 0,
      averageScore: 0
    },
    recentEvaluations: [],
    topPerformers: [],
    questionnaireStats: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('all');
  const [questionnaires, setQuestionnaires] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchReports();
    fetchQuestionnaires();
  }, [dateRange, selectedQuestionnaire]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch assignments for reports
      const assignmentsResponse = await axios.get('/evaluation/assignments', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          questionnaire_id: selectedQuestionnaire !== 'all' ? selectedQuestionnaire : undefined
        }
      });

      const assignments = assignmentsResponse.data;
      generateReports(assignments);
    } catch (error) {
      console.error('Error fetching reports:', error);
      showAlert('Error fetching reports', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionnaires = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/evaluation/questionnaires', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestionnaires(response.data);
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
    }
  };

  const generateReports = (assignments) => {
    // Filter by date range
    const now = new Date();
    const filteredAssignments = assignments.filter(assignment => {
      const assignedDate = new Date(assignment.assigned_at);
      switch (dateRange) {
        case 'last_7_days':
          return (now - assignedDate) <= 7 * 24 * 60 * 60 * 1000;
        case 'last_30_days':
          return (now - assignedDate) <= 30 * 24 * 60 * 60 * 1000;
        case 'last_90_days':
          return (now - assignedDate) <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    // Generate overview stats
    const completed = filteredAssignments.filter(a => a.status === 'completed');
    const pending = filteredAssignments.filter(a => a.status === 'pending');
    const averageScore = completed.length > 0 
      ? completed.reduce((sum, a) => sum + (a.total_score || 0), 0) / completed.length
      : 0;

    // Generate top performers
    const topPerformers = completed
      .filter(a => a.total_score)
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 10)
      .map(assignment => ({
        name: `${assignment.evaluatee?.first_name} ${assignment.evaluatee?.last_name}`,
        score: assignment.total_score,
        questionnaire: assignment.questionnaire?.title,
        completedAt: assignment.completed_at
      }));

    // Generate questionnaire stats
    const questionnaireStats = {};
    filteredAssignments.forEach(assignment => {
      const qId = assignment.questionnaire?.id;
      const qTitle = assignment.questionnaire?.title;
      if (!questionnaireStats[qId]) {
        questionnaireStats[qId] = {
          title: qTitle,
          total: 0,
          completed: 0,
          pending: 0,
          averageScore: 0,
          totalScore: 0
        };
      }
      questionnaireStats[qId].total++;
      if (assignment.status === 'completed') {
        questionnaireStats[qId].completed++;
        questionnaireStats[qId].totalScore += assignment.total_score || 0;
      } else if (assignment.status === 'pending') {
        questionnaireStats[qId].pending++;
      }
    });

    // Calculate average scores for questionnaires
    Object.keys(questionnaireStats).forEach(qId => {
      const stats = questionnaireStats[qId];
      stats.averageScore = stats.completed > 0 ? stats.totalScore / stats.completed : 0;
    });

    setReports({
      overview: {
        totalEvaluations: filteredAssignments.length,
        completedEvaluations: completed.length,
        pendingEvaluations: pending.length,
        averageScore: averageScore
      },
      recentEvaluations: completed.slice(0, 10),
      topPerformers,
      questionnaireStats: Object.values(questionnaireStats)
    });
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <Col md={3} className="mb-3">
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body className="d-flex align-items-center">
          <div className={`bg-${color} bg-opacity-10 p-3 rounded-3 me-3`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
          <div>
            <h4 className="fw-bold mb-1">{value}</h4>
            <small className="text-muted">{title}</small>
            {subtitle && <div><small className="text-muted">{subtitle}</small></div>}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="p-4">
      {alert.show && (
        <Alert variant={alert.variant} className="mb-3">
          {alert.message}
        </Alert>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Evaluation Reports</h4>
          <p className="text-muted mb-0">Analytics and insights on evaluation performance</p>
        </div>
        <Button variant="outline-primary">
          <Download size={18} className="me-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="all_time">All time</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedQuestionnaire}
            onChange={(e) => setSelectedQuestionnaire(e.target.value)}
          >
            <option value="all">All Questionnaires</option>
            {questionnaires.map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" className="me-2" />
          Loading reports...
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <Row className="mb-4">
            <StatCard
              icon={BarChart3}
              title="Total Evaluations"
              value={reports.overview.totalEvaluations}
              color="primary"
            />
            <StatCard
              icon={Award}
              title="Completed"
              value={reports.overview.completedEvaluations}
              color="success"
            />
            <StatCard
              icon={AlertCircle}
              title="Pending"
              value={reports.overview.pendingEvaluations}
              color="warning"
            />
            <StatCard
              icon={TrendingUp}
              title="Average Score"
              value={reports.overview.averageScore.toFixed(1)}
              subtitle="Out of 10"
              color="info"
            />
          </Row>

          <Row>
            {/* Questionnaire Performance */}
            <Col md={8} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Questionnaire Performance</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Questionnaire</th>
                        <th>Total</th>
                        <th>Completed</th>
                        <th>Pending</th>
                        <th>Avg Score</th>
                        <th>Completion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.questionnaireStats.map((stat, index) => (
                        <tr key={index}>
                          <td>{stat.title}</td>
                          <td>{stat.total}</td>
                          <td>
                            <Badge bg="success">{stat.completed}</Badge>
                          </td>
                          <td>
                            <Badge bg="warning">{stat.pending}</Badge>
                          </td>
                          <td>{stat.averageScore.toFixed(1)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-fill me-2" style={{ height: '6px' }}>
                                <div
                                  className="progress-bar"
                                  style={{ 
                                    width: `${(stat.completed / stat.total) * 100}%` 
                                  }}
                                />
                              </div>
                              <small>{Math.round((stat.completed / stat.total) * 100)}%</small>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            {/* Top Performers */}
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">Top Performers</h5>
                </Card.Header>
                <Card.Body>
                  {reports.topPerformers.length === 0 ? (
                    <p className="text-muted text-center py-3">No completed evaluations yet</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {reports.topPerformers.map((performer, index) => (
                        <div key={index} className="list-group-item border-0 px-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-semibold">{performer.name}</div>
                              <small className="text-muted">{performer.questionnaire}</small>
                            </div>
                            <Badge bg="primary" pill>{performer.score.toFixed(1)}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Evaluations */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Recent Completed Evaluations</h5>
            </Card.Header>
            <Card.Body>
              {reports.recentEvaluations.length === 0 ? (
                <p className="text-muted text-center py-3">No recent evaluations</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Evaluatee</th>
                      <th>Evaluator</th>
                      <th>Questionnaire</th>
                      <th>Score</th>
                      <th>Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.recentEvaluations.map((evaluation, index) => (
                      <tr key={index}>
                        <td>
                          <div className="fw-semibold">
                            {evaluation.evaluatee?.first_name} {evaluation.evaluatee?.last_name}
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {evaluation.evaluator?.first_name} {evaluation.evaluator?.last_name}
                          </small>
                        </td>
                        <td>
                          <small>{evaluation.questionnaire?.title}</small>
                        </td>
                        <td>
                          <Badge bg="primary">{evaluation.total_score?.toFixed(1) || 'N/A'}</Badge>
                        </td>
                        <td>
                          <small className="text-muted">
                            {evaluation.completed_at 
                              ? new Date(evaluation.completed_at).toLocaleDateString()
                              : 'N/A'
                            }
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default EvaluationReports;