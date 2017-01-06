import React from 'react';
import { Field, reduxForm } from 'redux-form';

const pureLoginForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        <label>Username</label>
        <Field name="username" component="input" type="text"
               placeholder="Username" required />
      </div>
      <div>
        <label>Password</label>
        <Field name="password" component="input" type="password"
               placeholder="Password" required />
      </div>
      <div>
        <button className="btn btn-primary"
                type="submit" disabled={props.pristine || props.submitting}>
          Log in
        </button>
      </div>
    </form>
  );
}

export default {
  form: reduxForm({
    form: 'login-form',
    getFormState: (state) => state.get('form').toJS(),
  })(pureLoginForm),
};
