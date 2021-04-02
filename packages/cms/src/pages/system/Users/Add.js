import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormGroup,
  CLabel,
  CRow,
} from "@coreui/react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import CIcon from "@coreui/icons-react";

import create from "api/create";

const Add = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async ({ firstName, lastName, email, group }) =>
    await create({
      apiName: "Users",
      data: {
        firstName,
        lastName,
        email,
        group,
      },
    });

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      await createUser(data);
      history.push("/system/users");
    } catch (err) {
      setError(err);
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <CCard>
        <CCardHeader>
          <h3 id="addTitle">Add User</h3>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="12">
              {error && (
                <p className="text-danger text-center">
                  <strong>{error}</strong>
                </p>
              )}
              <CFormGroup>
                <CLabel htmlFor="firstName">Email</CLabel>
                <input
                  type="email"
                  className={`form-control ${errors.email && "is-invalid"}`}
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  ref={register({ required: true })}
                  disabled={processing}
                  autoComplete="off"
                />
                <small className="form-text text-muted">
                  A temporary password will be sent to this email address.
                </small>
                {errors.email && (
                  <div className="invalid-feedback">Please provide email.</div>
                )}
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="group">Group</CLabel>
                <select
                  className={`form-control ${errors.group && "is-invalid"}`}
                  id="group"
                  name="group"
                  ref={register({ required: true })}
                  disabled={processing}
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.group && (
                  <div className="invalid-feedback">Please provide group.</div>
                )}
              </CFormGroup>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CButton
            type="submit"
            id="addUser"
            size="sm"
            color="primary"
            className="mr-2"
            disabled={processing}
          >
            <CIcon name="cil-scrubber" /> Submit
          </CButton>
          <CButton
            type="button"
            id="cancel"
            size="sm"
            color="danger"
            className="mr-2"
            disabled={processing}
            onClick={() => history.push("/system/users")}
          >
            <CIcon name="cil-ban" /> Cancel
          </CButton>
        </CCardFooter>
      </CCard>
    </form>
  );
};

export default Add;