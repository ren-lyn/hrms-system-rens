import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { Plus, FileText, Users, Settings, BarChart3 } from 'lucide-react';
import QuestionnaireManager from './QuestionnaireManager';
import AssignmentManager from './AssignmentManager';
import EvaluationTemplates from './EvaluationTemplates';
import EvaluationReports from './EvaluationReports';

const EvaluationDashboard = () => {
  const [activeTab, setActiveTab] = useState('questionnaires');
  const [stats, setStats] = useState({
    totalQuestionnaires: 0,
    activeAssignments: 0,
    completedEvaluations: 0,
    pendingEvaluations: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // This would typically be a combined API call for dashboard stats
      // For now, we'll simulate the stats
      setStats({
        totalQuestionnaires: 12,
        activeAssignments: 45,
        completedEvaluations: 23,
        pendingEvaluations: 22
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = 'primary' }) => (
    <Col md={3} className="mb-3">
      <Card className="h-100 border-0 shadow-sm">
        <Card.Body className="d-flex align-items-center">
          <div className={`bg-${color} bg-opacity-10 p-3 rounded-3 me-3`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
          <div>
            <h5 className="fw-bold mb-1">{value}</h5>
            <small className="text-muted">{title}</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Evaluation Management</h2>
          <p className="text-muted mb-0">Manage evaluation questionnaires and assignments</p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <Row className="mb-4">
        <StatCard 
          icon={FileText} 
          title="Total Questionnaires" 
          value={stats.totalQuestionnaires}
          color="primary"
        />
        <StatCard 
          icon={Users} 
          title="Active Assignments" 
          value={stats.activeAssignments}
          color="info"
        />
        <StatCard 
          icon={BarChart3} 
          title="Completed Evaluations" 
          value={stats.completedEvaluations}
          color="success"
        />
        <StatCard 
          icon={Settings} 
          title="Pending Evaluations" 
          value={stats.pendingEvaluations}
          color="warning"
        />
      </Row>

      {/* Main Content Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <Nav variant="tabs" className="border-0">
              <Nav.Item>
                <Nav.Link eventKey="questionnaires" className="border-0">
                  <FileText size={18} className="me-2" />
                  Questionnaires
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="assignments" className="border-0">
                  <Users size={18} className="me-2" />
                  Assignments
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="templates" className="border-0">
                  <Settings size={18} className="me-2" />
                  Templates
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports" className="border-0">
                  <BarChart3 size={18} className="me-2" />
                  Reports
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          
          <Card.Body className="p-0">
            <Tab.Content>
              <Tab.Pane eventKey="questionnaires">
                <QuestionnaireManager onStatsUpdate={fetchDashboardStats} />
              </Tab.Pane>
              <Tab.Pane eventKey="assignments">
                <AssignmentManager onStatsUpdate={fetchDashboardStats} />
              </Tab.Pane>
              <Tab.Pane eventKey="templates">
                <EvaluationTemplates />
              </Tab.Pane>
              <Tab.Pane eventKey="reports">
                <EvaluationReports />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </Container>
  );
};

export default EvaluationDashboard;