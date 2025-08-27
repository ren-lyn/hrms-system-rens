import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Form, Modal,
  Badge, Alert, Spinner, Dropdown
} from 'react-bootstrap';
import {
  UserPlus, Search, Filter, Eye, Trash2, Send,
  MoreVertical, Users, Clock, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import AssignmentForm from './AssignmentForm';

const AssignmentManager = ({ onStatsUpdate }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [questionnaireFilter, setQuestionnaireFilter] = useState('all');
  const [questionnaires, setQuestionnaires] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchAssignments();
    fetchQuestionnaires();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchAssignments();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, questionnaireFilter]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/evaluation/assignments', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          questionnaire_id: questionnaireFilter !== 'all' ? questionnaireFilter : undefined
        }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      showAlert('Error fetching assignments', 'danger');
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

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const handleAssignmentSuccess = () => {
    setShowAssignmentForm(false);
    fetchAssignments();
    if (onStatsUpdate) onStatsUpdate();
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/evaluation/assignments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showAlert('Assignment deleted successfully');
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        showAlert(error.response?.data?.message || 'Error deleting assignment', 'danger');
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      in_progress: 'info',
      completed: 'success',
      cancelled: 'secondary'
    };
    const icons = {
      pending: Clock,
      in_progress: Users,
      completed: CheckCircle,
      cancelled: MoreVertical
    };
    const Icon = icons[status];
    return (
      <Badge bg={variants[status] || 'secondary'} className="d-flex align-items-center gap-1">
        <Icon size={12} />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const filteredAssignments = assignments.filter(assignment => {
    const evaluatorName = `${assignment.evaluator?.first_name || ''} ${assignment.evaluator?.last_name || ''}`.toLowerCase();
    const evaluateeName = `${assignment.evaluatee?.first_name || ''} ${assignment.evaluatee?.last_name || ''}`.toLowerCase();
    const questionnaireTitle = assignment.questionnaire?.title?.toLowerCase() || '';
    
    return evaluatorName.includes(searchTerm.toLowerCase()) ||
           evaluateeName.includes(searchTerm.toLowerCase()) ||
           questionnaireTitle.includes(searchTerm.toLowerCase());
  });

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
          <h4 className="mb-1">Evaluation Assignments</h4>
          <p className="text-muted mb-0">Assign evaluations to evaluators</p>
        </div>
        <Button variant="primary" onClick={() => setShowAssignmentForm(true)}>
          <UserPlus size={18} className="me-2" />
          New Assignment
        </Button>
      </div>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={4}>
          <div className="position-relative">
            <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <Form.Control
              type="text"
              placeholder="Search assignments..."
              className="ps-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={5}>
          <Form.Select
            value={questionnaireFilter}
            onChange={(e) => setQuestionnaireFilter(e.target.value)}
          >
            <option value="all">All Questionnaires</option>
            {questionnaires.map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Assignments Table */}
      <Card className="border-0 shadow-sm">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>Questionnaire</th>
              <th>Evaluator</th>
              <th>Evaluatee</th>
              <th>Status</th>
              <th>Assigned</th>
              <th>Due Date</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading assignments...
                </td>
              </tr>
            ) : filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No assignments found
                </td>
              </tr>
            ) : (
              filteredAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>
                    <div>
                      <div className="fw-semibold">{assignment.questionnaire?.title}</div>
                      <small className="text-muted">
                        {assignment.questionnaire?.evaluation_period}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">
                        {assignment.evaluator?.first_name} {assignment.evaluator?.last_name}
                      </div>
                      <small className="text-muted">{assignment.evaluator?.email}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">
                        {assignment.evaluatee?.first_name} {assignment.evaluatee?.last_name}
                      </div>
                      <small className="text-muted">{assignment.evaluatee?.email}</small>
                    </div>
                  </td>
                  <td>{getStatusBadge(assignment.status)}</td>
                  <td>
                    <small className="text-muted">
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <small className="text-muted">
                      {assignment.questionnaire?.due_date 
                        ? new Date(assignment.questionnaire.due_date).toLocaleDateString()
                        : 'No due date'
                      }
                    </small>
                  </td>
                  <td>
                    {assignment.status === 'completed' ? (
                      <div>
                        <div className="fw-semibold text-success">Completed</div>
                        <small className="text-muted">
                          Score: {assignment.total_score?.toFixed(1) || 'N/A'}
                        </small>
                      </div>
                    ) : assignment.status === 'in_progress' ? (
                      <div>
                        <div className="fw-semibold text-info">In Progress</div>
                        <small className="text-muted">Draft saved</small>
                      </div>
                    ) : (
                      <span className="text-muted">Not started</span>
                    )}
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="ghost" size="sm" className="border-0">
                        <MoreVertical size={16} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href={`#/assignment/${assignment.id}`}>
                          <Eye size={16} className="me-2" />
                          View Details
                        </Dropdown.Item>
                        {assignment.status !== 'completed' && (
                          <>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              onClick={() => handleDeleteAssignment(assignment.id)}
                              className="text-danger"
                            >
                              <Trash2 size={16} className="me-2" />
                              Delete
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Assignment Form Modal */}
      <Modal 
        show={showAssignmentForm} 
        onHide={() => setShowAssignmentForm(false)}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <AssignmentForm
            questionnaires={questionnaires}
            onSuccess={handleAssignmentSuccess}
            onCancel={() => setShowAssignmentForm(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AssignmentManager;