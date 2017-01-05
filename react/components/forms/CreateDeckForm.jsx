import React from 'react';
import { Field, reduxForm } from 'redux-form';

const pureCreateDeckForm = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        <label>Title</label>
        <div>
          <Field name="title" component="input" type="text"
                 placeholder="Deck Title" required />
        </div>
      </div>
      <div>
        <button className="btn btn-primary"
                type="submit" disabled={props.pristine || props.submitting}>
          Submit
        </button>
      </div>
    </form>
  );
}

export default {
  form: reduxForm({
    form: 'create-deck',
  })(pureCreateDeckForm),
};
