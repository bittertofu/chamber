import React from 'react';
import {Link} from 'react-router';
import LoginStore from '../stores/LoginStore';
import LoginActions from '../actions/LoginActions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = LoginStore.getState();
    this.onChange = this.onChange.bind(this);
  };

  componentDidMount() {
    LoginStore.listen(this.onChange);

    $('#login-popup a').popup({
      on: 'click',
      inline: true,
      position: 'bottom right'
    });

    $('#login-form').form({
      on: 'blur',
      inline: true,
      fields: {
        email: {
          identifier: 'email',
          rules: [
            { type: 'empty',
              prompt: 'Please enter a valid email' }
          ]
        },
        password: {
          identifier: 'password',
          rules: [
            { type: 'minLength[8]',
              prompt: 'Please enter a password with at least 8 alphanumeric characters' },
            { type: 'regExp[^(?=\\w*[a-zA-Z])\\w+$]',
              prompt: 'Please enter a password with only alphanumeric or underscore characters' },
            { type: 'regExp[^(?=\\w*[0-9])\\w+$]',
              prompt: 'Please enter a password with at least 1 numeric character' }
          ]
        }
      }
    });
  };

  componentWillUnmount() {
    LoginStore.unlisten(this.onChange);
  };

  onChange(state) {
    this.setState(state);
  };

  handleSubmit(event) {
    event.preventDefault();
    if ($('#login-form').form('is valid')) {
      var email = this.state.email.trim();
      var password = this.state.password.trim();

      LoginActions.loginUser(email, password, this.props.history);
    };
  };

  render() {
    return (
      <div id='login-popup'>
        <a className='item'>
          Login
          <i className='dropdown icon' />
        </a>
        <div className='ui popup'>
          <form id='login-form' className='ui form' onSubmit={this.handleSubmit.bind(this)}>
            <h3 className="ui dividing header">Log in as:</h3>
            <div className='field'>
              <label>Email</label>
              <input name='email' placeholder='example@examples.com' value={this.state.email} onChange={LoginActions.updateEmail} />
            </div>
            <div className='field'>
              <label>Password</label>
              <input type='password' name='password' placeholder='********' value={this.state.password} onChange={LoginActions.updatePassword} />
            </div>
            <div className='ui middle aligned two column grid'>
              <div className='column'>
                <button type='submit' className='ui fluid primary button'>Log in</button>
              </div>
              <div className='column center aligned'>
                Or <Link to='/signup' onClick={LoginActions.popupHide}>Sign up</Link>!
              </div>
            </div>
          </form>
        </div>

      </div>
    );
  };

};

export default Login;