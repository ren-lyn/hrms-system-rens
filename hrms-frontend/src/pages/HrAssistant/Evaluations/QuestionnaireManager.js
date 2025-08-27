import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Table, Form, Modal, 
  Badge, Dropdown, Alert, Spinner 
} from 'react-bootstrap';
import { 
  Plus, Search, Filter, Edit, Trash2, Copy, Eye, 
  Play, Pause, MoreVertical 
} from 'lucide-react';
import axios from 'axios';
import QuestionnaireForm from './QuestionnaireForm';

const QuestionnaireManager = ({ onStatsUpdate }) => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestionnaire, setEditingQuestionnaire] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/evaluation/questionnaires', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }
      });
      setQuestionnaires(response.data);
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      showAlert('Error fetching questionnaires', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchQuestionnaires();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter]);

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 5000);
  };

  const handleCreateNew = () => {
    setEditingQuestionnaire(null);
    setShowForm(true);
  };

  const handleEdit = (questionnaire) => {
    setEditingQuestionnaire(questionnaire);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingQuestionnaire(null);
    fetchQuestionnaires();
    if (onStatsUpdate) onStatsUpdate();
  };

  const handlePublish = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/evaluation/questionnaires/${id}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert('Questionnaire published successfully');
      fetchQuestionnaires();
    } catch (error) {
      console.error('Error publishing questionnaire:', error);
      showAlert('Error publishing questionnaire', 'danger');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/evaluation/questionnaires/${id}/unpublish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert('Questionnaire unpublished successfully');
      fetchQuestionnaires();
    } catch (error) {
      console.error('Error unpublishing questionnaire:', error);
      showAlert('Error unpublishing questionnaire', 'danger');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/evaluation/questionnaires/${id}/duplicate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert('Questionnaire duplicated successfully');
      fetchQuestionnaires();
    } catch (error) {
      console.error('Error duplicating questionnaire:', error);
      showAlert('Error duplicating questionnaire', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this questionnaire?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/evaluation/questionnaires/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showAlert('Questionnaire deleted successfully');
        fetchQuestionnaires();
      } catch (error) {
        console.error('Error deleting questionnaire:', error);
        showAlert(error.response?.data?.message || 'Error deleting questionnaire', 'danger');
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: 'secondary',
      published: 'success',
      archived: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

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
          <h4 className="mb-1">Evaluation Questionnaires</h4>
          <p className="text-muted mb-0">Create and manage evaluation questionnaires</p>
        </div>
        <Button variant="primary" onClick={handleCreateNew}>
          <Plus size={18} className="me-2" />
          Create Questionnaire
        </Button>
      </div>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={6}>
          <div className="position-relative">
            <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <Form.Control
              type="text"
              placeholder="Search questionnaires..."
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
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Questionnaires Table */}
      <Card className="border-0 shadow-sm">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Questions</th>
              <th>Created</th>
              <th>Creator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading questionnaires...
                </td>
              </tr>
            ) : questionnaires.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No questionnaires found
                </td>
              </tr>
            ) : (
              questionnaires.map((questionnaire) => (
                <tr key={questionnaire.id}>
                  <td>
                    <div>
                      <div className="fw-semibold">{questionnaire.title}</div>
                      {questionnaire.description && (
                        <small className="text-muted">
                          {questionnaire.description.substring(0, 100)}
                          {questionnaire.description.length > 100 && '...'}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(questionnaire.status)}</td>
                  <td>{questionnaire.questions?.length || 0}</td>
                  <td>
                    <small className="text-muted">
                      {new Date(questionnaire.created_at).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <small className="text-muted">
                      {questionnaire.creator?.first_name} {questionnaire.creator?.last_name}
                    </small>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="ghost" size="sm" className="border-0">
                        <MoreVertical size={16} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEdit(questionnaire)}>
                          <Edit size={16} className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDuplicate(questionnaire.id)}>
                          <Copy size={16} className="me-2" />
                          Duplicate
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        {questionnaire.status === 'draft' ? (
                          <Dropdown.Item onClick={() => handlePublish(questionnaire.id)}>
                            <Play size={16} className="me-2" />
                            Publish
                          </Dropdown.Item>
                        ) : questionnaire.status === 'published' ? (
                          <Dropdown.Item onClick={() => handleUnpublish(questionnaire.id)}>
                            <Pause size={16} className="me-2" />
                            Unpublish
                          </Dropdown.Item>
                        ) : null}
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={() => handleDelete(questionnaire.id)}
                          className="text-danger"
                        >
                          <Trash2 size={16} className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Questionnaire Form Modal */}
      <Modal 
        show={showForm} 
        onHide={() => setShowForm(false)}
        size="xl"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestionnaire ? 'Edit Questionnaire' : 'Create New Questionnaire'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <QuestionnaireForm
            questionnaire={editingQuestionnaire}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default QuestionnaireManager;