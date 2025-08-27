import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Table, Form,
  Badge, Alert, Spinner, Modal
} from 'react-bootstrap';
import {
  Template, Search, Copy, Eye, Trash2, Plus
} from 'lucide-react';
import axios from 'axios';

const EvaluationTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/evaluation/templates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      showAlert('Error fetching templates', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const handleUseTemplate = async (templateId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/evaluation/questionnaires/${templateId}/duplicate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert('Template has been copied as a new questionnaire');
    } catch (error) {
      console.error('Error using template:', error);
      showAlert('Error using template', 'danger');
    }
  };

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const filteredTemplates = templates.filter(template => {
    const title = (template.title || '').toLowerCase();
    const description = (template.description || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return title.includes(searchLower) || description.includes(searchLower);
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
          <h4 className="mb-1">Evaluation Templates</h4>
          <p className="text-muted mb-0">Reuse existing questionnaires as templates</p>
        </div>
      </div>

      {/* Search */}
      <Row className="mb-3">
        <Col md={6}>
          <div className="position-relative">
            <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <Form.Control
              type="text"
              placeholder="Search templates..."
              className="ps-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Col>
      </Row>

      {/* Templates Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" className="me-2" />
          Loading templates...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <Template size={64} className="text-muted mb-3" />
            <h5 className="text-muted">No Templates Found</h5>
            <p className="text-muted">
              {searchTerm ? 'No templates match your search criteria.' : 'No templates have been created yet.'}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredTemplates.map(template => (
            <Col md={6} lg={4} key={template.id} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <Badge bg="primary" className="mb-2">
                      <Template size={12} className="me-1" />
                      Template
                    </Badge>
                    <Badge bg="secondary">{template.questions?.length || 0} Questions</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <h6 className="card-title mb-2">{template.title}</h6>
                  <p className="card-text text-muted small">
                    {template.description ? (
                      template.description.length > 100 
                        ? `${template.description.substring(0, 100)}...`
                        : template.description
                    ) : 'No description available'}
                  </p>
                  <div className="mb-3">
                    {template.evaluation_period && (
                      <Badge bg="info" className="me-2">{template.evaluation_period}</Badge>
                    )}
                    <small className="text-muted">
                      Created: {new Date(template.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                      className="flex-fill"
                    >
                      <Eye size={14} className="me-1" />
                      Preview
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUseTemplate(template.id)}
                      className="flex-fill"
                    >
                      <Copy size={14} className="me-1" />
                      Use Template
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Template Preview Modal */}
      <Modal 
        show={showPreview} 
        onHide={() => setShowPreview(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Template Preview: {selectedTemplate?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTemplate && (
            <div>
              <div className="mb-4">
                <h6>Description</h6>
                <p className="text-muted">
                  {selectedTemplate.description || 'No description provided'}
                </p>
              </div>

              {selectedTemplate.instructions && (
                <div className="mb-4">
                  <h6>Instructions</h6>
                  <div className="bg-light p-3 rounded">
                    {selectedTemplate.instructions}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h6>Template Information</h6>
                <Row>
                  <Col md={6}>
                    <small className="text-muted">Questions:</small>
                    <div>{selectedTemplate.questions?.length || 0}</div>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">Evaluation Period:</small>
                    <div>{selectedTemplate.evaluation_period || 'Not specified'}</div>
                  </Col>
                </Row>
              </div>

              <div>
                <h6>Questions Preview</h6>
                {selectedTemplate.questions && selectedTemplate.questions.length > 0 ? (
                  <div className="border rounded">
                    {selectedTemplate.questions.slice(0, 5).map((question, index) => (
                      <div key={question.id} className="border-bottom p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="secondary">Q{index + 1}</Badge>
                          <Badge bg="info">{question.question_type}</Badge>
                        </div>
                        <div className="fw-semibold mb-1">{question.question_text}</div>
                        {question.description && (
                          <small className="text-muted">{question.description}</small>
                        )}
                        <div className="mt-2">
                          <small className="text-muted">
                            Score Range: {question.min_score} - {question.max_score}
                            {question.category && ` | Category: ${question.category}`}
                          </small>
                        </div>
                      </div>
                    ))}
                    {selectedTemplate.questions.length > 5 && (
                      <div className="p-3 text-center text-muted">
                        <small>... and {selectedTemplate.questions.length - 5} more questions</small>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted">No questions available</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              handleUseTemplate(selectedTemplate.id);
              setShowPreview(false);
            }}
          >
            <Copy size={16} className="me-1" />
            Use This Template
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EvaluationTemplates;