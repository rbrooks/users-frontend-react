import React, { PureComponent } from 'react';
import { Icon, Table, Button, Divider, Popconfirm, message } from 'antd';
import ModalForm from './ModalForm';

class Listable extends PureComponent {
  static ACTIONS = {
    CREATING: 'creating',
    EDITING: 'editing',
  };

  state = {
    currentAction: null,
    formFields: {},
  };

  openModal = (type, index) => {
    const { data } = this.props;

    this.setState({
      currentAction: type,
      formFields: index != null ? data[index] : {},
    });
  };

  closeModal = () => {
    this.setState({ currentAction: null, formFields: {} });
  };

  closeModalAndSave = newFormFields => {
    const { currentAction, formFields } = this.state;

    if (currentAction === Listable.ACTIONS.EDITING) {
      this.onEdit({ ...formFields, ...newFormFields });
    } else {
      this.onCreate(newFormFields);
    }

    this.closeModal();
  };

  onCreate = data => {
    const { handleCreate } = this.props;

    handleCreate(data);

    setTimeout(() => message.success('User successfully created.'), 300);
  };

  onEdit = data => {
    const { handleEdit } = this.props;

    handleEdit(data);

    setTimeout(() => message.success('User successfully edited.'), 300);
  };

  onRemove = id => {
    const { handleRemove } = this.props;

    handleRemove(id);

    message.success('User successfully deleted.');
  };

  getColumns = () => {
    const { columns } = this.props;

    return [
      ...columns,
      {
        title: 'Action',
        key: 'action',
        render: (text, record, index) => (
          <span key={record.id}>
            <Button
              size="small"
              title="edit"
              alt="edit"
              onClick={() => this.openModal(Listable.ACTIONS.EDITING, index)}
            >
              <Icon type="edit" />
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => this.onRemove(record.id)}
              cancelText="No"
              okText="Yes"
            >
              <Button type="danger" size="small" title="delete" alt="delete">
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ];
  };

  getModalTitle = () => {
    const { CREATING } = Listable.ACTIONS;
    const { currentAction } = this.state;

    return currentAction === CREATING ? 'Create' : 'Edit';
  };

   onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  }

  render() {
    const { currentAction, formFields } = this.state;
    const { data, Form } = this.props;

    return (
      <React.Fragment>
        <Table
          rowKey={record => record.id}
          dataSource={data}
          columns={this.getColumns()}
          onChange={this.onChange()}
          title={() => (
            <Button
              type="primary"
              onClick={() => this.openModal(Listable.ACTIONS.CREATING)}
              title="Create user"
              alt="create"
            >
              <Icon type="user-add" />
              Create
            </Button>
          )}
        />
        <ModalForm
          title={this.getModalTitle()}
          visible={!!currentAction}
          handleCancel={this.closeModal}
          handleOk={this.closeModalAndSave}
        >
          <Form fields={formFields} />
        </ModalForm>
      </React.Fragment>
    );
  }
}

export default Listable;
