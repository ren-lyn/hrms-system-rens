import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Alert,
  Table, Badge, Modal
} from 'react-bootstrap';
import {
  UserPlus, X, Save, Users, FileText, Search, Plus, Trash2
} from 'lucide-react';
import axios from 'axios';

const AssignmentForm = ({ questionnaires, onSuccess, onCancel }) => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('');
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [selectingFor, setSelectingFor] = useState(null); // 'evaluator' or 'evaluatee'

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showAlert('Error fetching employees', 'danger');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const addAssignment = () => {
    setAssignments(prev => [...prev, {
      id: Date.now(),
      evaluator_id: '',
      evaluatee_id: '',
      evaluator: null,
      evaluatee: null
    }]);
  };

  const updateAssignment = (index, field, value, employee = null) => {
    setAssignments(prev => prev.map((assignment, i) => {
      if (i === index) {
        const updated = { ...assignment, [field]: value };
        if (employee) {
          updated[field.replace('_id', '')] = employee;
        }
        return updated;
      }
      return assignment;
    }));
  };

  const removeAssignment = (index) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmployeeSelect = (employee) => {
    const { currentIndex } = selectingFor;
    const field = selectingFor.type === 'evaluator' ? 'evaluator_id' : 'evaluatee_id';
    updateAssignment(currentIndex, field, employee.id, employee);
    setShowEmployeeModal(false);
    setSelectingFor(null);
  };

  const openEmployeeSelector = (type, index) => {
    setSelectingFor({ type, currentIndex: index });
    setShowEmployeeModal(true);
  };

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`.toLowerCase();
    const email = (employee.email || '').toLowerCase();
    const searchLower = employeeSearchTerm.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedQuestionnaire) {
      showAlert('Please select a questionnaire', 'danger');
      return;
    }

    if (assignments.length === 0) {
      showAlert('Please add at least one assignment', 'danger');
      return;
    }

    // Validate assignments
    const invalidAssignments = assignments.filter(
      assignment => !assignment.evaluator_id || !assignment.evaluatee_id
    );

    if (invalidAssignments.length > 0) {
      showAlert('Please select both evaluator and evaluatee for all assignments', 'danger');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/evaluation/assignments', {
        evaluation_questionnaire_id: selectedQuestionnaire,
        assignments: assignments.map(assignment => ({
          evaluator_id: assignment.evaluator_id,
          evaluatee_id: assignment.evaluatee_id
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showAlert('Assignments created successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating assignments:', error);
      showAlert(
        error.response?.data?.message || 'Error creating assignments',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedQuestionnaireData = questionnaires.find(
    q => q.id === parseInt(selectedQuestionnaire)
  );

  return (
    <Container fluid className="p-4">
      {alert.show && (
        <Alert variant={alert.variant} className="mb-3">
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Questionnaire Selection */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <div className="d-flex align-items-center">
              <FileText size={20} className="me-2" />
              <h5 className="mb-0">Select Questionnaire</h5>
            </div>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Questionnaire *</Form.Label>
              <Form.Select
                required
                value={selectedQuestionnaire}
                onChange={(e) => setSelectedQuestionnaire(e.target.value)}
              >
                <option value="">Select a questionnaire...</option>
                {questionnaires
                  .filter(q => q.status === 'published')
                  .map(questionnaire => (
                    <option key={questionnaire.id} value={questionnaire.id}>
                      {questionnaire.title}
                      {questionnaire.evaluation_period && ` (${questionnaire.evaluation_period})`}
                    </option>
                  ))
                }
              </Form.Select>
            </Form.Group>

            {selectedQuestionnaireData && (
              <div className="bg-light p-3 rounded">
                <h6 className="mb-2">{selectedQuestionnaireData.title}</h6>
                <p className="mb-2 text-muted">{selectedQuestionnaireData.description}</p>
                <div className="d-flex gap-3">
                  <Badge bg="info">{selectedQuestionnaireData.questions?.length || 0} Questions</Badge>
                  {selectedQuestionnaireData.evaluation_period && (
                    <Badge bg="secondary">{selectedQuestionnaireData.evaluation_period}</Badge>
                  )}
                  {selectedQuestionnaireData.due_date && (
                    <Badge bg="warning">
                      Due: {new Date(selectedQuestionnaireData.due_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Assignments */}
        <Card className="mb-4">
          <Card.Header className="bg-info text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Users size={20} className="me-2" />
                <h5 className="mb-0">Assignments ({assignments.length})</h5>
              </div>
              <Button variant="light" size="sm" onClick={addAssignment}>
                <Plus size={16} className="me-1" />
                Add Assignment
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {assignments.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <Users size={48} className="mb-3 opacity-50" />
                <p>No assignments added yet. Click "Add Assignment" to get started.</p>
              </div>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Evaluator</th>
                    <th>Evaluatee</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment, index) => (
                    <tr key={assignment.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => openEmployeeSelector('evaluator', index)}
                            className="me-2"
                          >
                            <UserPlus size={14} />
                          </Button>
                          {assignment.evaluator ? (
                            <div>
                              <div className="fw-semibold">
                                {assignment.evaluator.first_name} {assignment.evaluator.last_name}
                              </div>
                              <small className="text-muted">{assignment.evaluator.email}</small>
                            </div>
                          ) : (
                            <span className="text-muted">Select evaluator</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => openEmployeeSelector('evaluatee', index)}
                            className="me-2"
                          >
                            <UserPlus size={14} />
                          </Button>
                          {assignment.evaluatee ? (
                            <div>
                              <div className="fw-semibold">
                                {assignment.evaluatee.first_name} {assignment.evaluatee.last_name}
                              </div>
                              <small className="text-muted">{assignment.evaluatee.email}</small>
                            </div>
                          ) : (
                            <span className="text-muted">Select evaluatee</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeAssignment(index)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <Button variant="outline-secondary" onClick={onCancel} disabled={loading}>
            <X size={16} className="me-1" />
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            <Save size={16} className="me-1" />
            {loading ? 'Creating...' : 'Create Assignments'}
          </Button>
        </div>
      </Form>

      {/* Employee Selection Modal */}
      <Modal 
        show={showEmployeeModal} 
        onHide={() => setShowEmployeeModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Select {selectingFor?.type === 'evaluator' ? 'Evaluator' : 'Evaluatee'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <Form.Control
                type="text"
                placeholder="Search employees..."
                className="ps-5"
                value={employeeSearchTerm}
                onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              />
            </div>
          </Form.Group>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loadingEmployees ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm me-2" />
                Loading employees...
              </div>
            ) : (
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(employee => (
                    <tr key={employee.id}>
                      <td>
                        <div className="fw-semibold">
                          {employee.first_name} {employee.last_name}
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">{employee.email}</small>
                      </td>
                      <td>
                        <small className="text-muted">
                          {employee.employee_profile?.department || 'N/A'}
                        </small>
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEmployeeSelect(employee)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AssignmentForm;