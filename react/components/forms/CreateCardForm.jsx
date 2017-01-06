import React from 'react';
import { Field, reduxForm } from 'redux-form';

import MarkdownTextarea from '../inputs/MarkdownTextarea';

const pureCreateCardForm = (props) => {
  let conditionalSection = (
    <div>
      This will eventually have the derivation steps...
    </div>
  );
  if (props.card_type !== 'd') {
    conditionalSection = (
      <div>
        <label>Back face</label>
        <div>
          <Field name="back" component={MarkdownTextarea}
                 placeholder="Card Front" required />
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        <label>Card Type</label>
        <div>
          <Field name="card_type" value="o" component="select">
            <option value="o">One sided</option>
            <option value="t">Two sided</option>
            <option value="d">Derivation</option>
          </Field>
        </div>
      </div>
      <div>
        <label>Front face</label>
        <div>
          <Field name="front" component={MarkdownTextarea}
                 placeholder="Card Front" required />
        </div>
      </div>
      { conditionalSection }
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
    form: 'create-card',
    getFormState: (state) => state.get('form').toJS(),
  })(pureCreateCardForm),
};
