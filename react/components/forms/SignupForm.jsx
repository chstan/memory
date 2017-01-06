import React from 'react';
import { Field, reduxForm } from 'redux-form';

const renderTextField = ({
  input, ...extra, label, placeholder,
  type, meta: { touched, error, warning } }) => {
    let wrapperClass = 'form-group';
    if (error) {
      wrapperClass += ' has-error';
    } else if (warning) {
      wrapperClass += ' has-warning'
    }
    return (
      <div className={wrapperClass}>
        <label>{label}</label>
        <div>
          <input {...input} placeholder={placeholder} type={type}
                 className={extra.className || ''} />
          { touched && ((error || warning) &&
                        <span className="help-block">{error || warning}</span>)}
        </div>
      </div>
    )
  }


const pureSignupForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <Field name="email" component={renderTextField} type="text"
             placeholder="Email" label="Email address" required className="form-control" />
      <Field name="password" component={renderTextField} type="password"
             placeholder="Password" label="Password" required className="form-control" />
      <Field name="confirmation" component={renderTextField} type="password"
             placeholder="Confirmation" label="Password Confirmation" required
             className="form-control" />
      <button type="submit" className="btn btn-primary"
              disabled={props.pristine || props.submitting}>Sign up</button>
    </form>
  );
}

const validate = values => {
  const errors = {};

  if (!values.password) {
    errors.password = 'Required';
  }
  if (values.password !== values.confirmation) {
    errors.confirmation = 'Password and confirmation must match';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
}

export default {
  form: reduxForm({
    form: 'signup-form',
    validate,
    getFormState: (state) => state.get('form').toJS(),
  })(pureSignupForm),
};
