import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Form, Alert,
  InputGroup, Badge, Modal
} from 'react-bootstrap';
import {
  Plus, Trash2, ArrowUp, ArrowDown, Save, X,
  FileText, Settings, Calendar
} from 'lucide-react';
import axios from 'axios';

const QuestionnaireForm = ({ questionnaire, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'draft',
    is_template: false,
    evaluation_period: '',
    due_date: '',
    instructions: '',
    questions: []
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    if (questionnaire) {
      setFormData({
        title: questionnaire.title || '',
        description: questionnaire.description || '',
        status: questionnaire.status || 'draft',
        is_template: questionnaire.is_template || false,
        evaluation_period: questionnaire.evaluation_period || '',
        due_date: questionnaire.due_date ? questionnaire.due_date.split('T')[0] : '',
        instructions: questionnaire.instructions || '',
        questions: questionnaire.questions || []
      });
    }
  }, [questionnaire]);

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(), // Temporary ID for frontend
      question_text: '',
      question_type: 'rating',
      min_score: 0,
      max_score: 10,
      is_required: true,
      category: '',
      description: '',
      options: []
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const moveQuestion = (index, direction) => {
    const newQuestions = [...formData.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newQuestions.length) {
      [newQuestions[index], newQuestions[targetIndex]] = 
      [newQuestions[targetIndex], newQuestions[index]];
      setFormData(prev => ({ ...prev, questions: newQuestions }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.questions.length === 0) {
      showAlert('Please add at least one question', 'danger');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = questionnaire ? 'put' : 'post';
      const url = questionnaire 
        ? `/evaluation/questionnaires/${questionnaire.id}`
        : '/evaluation/questionnaires';

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showAlert(
        questionnaire 
          ? 'Questionnaire updated successfully' 
          : 'Questionnaire created successfully'
      );
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      showAlert(
        error.response?.data?.message || 'Error saving questionnaire',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  };

  const QuestionTypeOptions = [
    { value: 'rating', label: 'Rating Scale' },
    { value: 'text', label: 'Text Response' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'yes_no', label: 'Yes/No' },
    { value: 'scale', label: 'Custom Scale' }
  ];

  return (
    <Container fluid className="p-4">
      {alert.show && (
        <Alert variant={alert.variant} className="mb-3">
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <div className="d-flex align-items-center">
              <FileText size={20} className="me-2" />
              <h5 className="mb-0">Basic Information</h5>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter questionnaire title"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose and scope of this evaluation"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Evaluation Period</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.evaluation_period}
                    onChange={(e) => setFormData(prev => ({ ...prev, evaluation_period: e.target.value }))}
                    placeholder="e.g., Q1 2024, Annual Review"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Instructions for evaluators"
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              label="Save as template"
              checked={formData.is_template}
              onChange={(e) => setFormData(prev => ({ ...prev, is_template: e.target.checked }))}
            />
          </Card.Body>
        </Card>

        {/* Questions Section */}
        <Card className="mb-4">
          <Card.Header className="bg-info text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Settings size={20} className="me-2" />
                <h5 className="mb-0">Questions ({formData.questions.length})</h5>
              </div>
              <Button variant="light" size="sm" onClick={addQuestion}>
                <Plus size={16} className="me-1" />
                Add Question
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {formData.questions.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <Settings size={48} className="mb-3 opacity-50" />
                <p>No questions added yet. Click "Add Question" to get started.</p>
              </div>
            ) : (
              formData.questions.map((question, index) => (
                <Card key={question.id || index} className="mb-3 border">
                  <Card.Header className="bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="secondary">Question {index + 1}</Badge>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp size={14} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === formData.questions.length - 1}
                        >
                          <ArrowDown size={14} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>Question Text *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            required
                            value={question.question_text}
                            onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                            placeholder="Enter your question"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Question Type</Form.Label>
                          <Form.Select
                            value={question.question_type}
                            onChange={(e) => updateQuestion(index, 'question_type', e.target.value)}
                          >
                            {QuestionTypeOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Category</Form.Label>
                          <Form.Control
                            type="text"
                            value={question.category}
                            onChange={(e) => updateQuestion(index, 'category', e.target.value)}
                            placeholder="e.g., Performance, Behavior"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Min Score</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            value={question.min_score}
                            onChange={(e) => updateQuestion(index, 'min_score', parseInt(e.target.value))}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Max Score</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={question.max_score}
                            onChange={(e) => updateQuestion(index, 'max_score', parseInt(e.target.value))}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Description/Instructions</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={question.description}
                        onChange={(e) => updateQuestion(index, 'description', e.target.value)}
                        placeholder="Additional instructions for this question"
                      />
                    </Form.Group>

                    <Form.Check
                      type="checkbox"
                      label="Required question"
                      checked={question.is_required}
                      onChange={(e) => updateQuestion(index, 'is_required', e.target.checked)}
                    />
                  </Card.Body>
                </Card>
              ))
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
            {loading ? 'Saving...' : (questionnaire ? 'Update' : 'Create')} Questionnaire
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default QuestionnaireForm;