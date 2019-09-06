import React, { Component } from 'react';

class AuthForm extends Component {
  constructor(props) {
    super(props);

    if (this.props.name === 'signup') {
      this.state = {
        name: '',
        email: '',
        password: ''
      };
    } else {
      this.state = {
        email: '',
        password: ''
      };
    }
  }

  onSubmit = event => {
    event.preventDefault();

    this.props.onSubmit(this.state);
  };

  render() {
    return (
      <div className="row">
        <form onSubmit={this.onSubmit} className="col s6">
          {
            this.props.name === 'signup' && (
              <div className="input-field">
                <input
                  placeholder="Name"
                  type="text"
                  value={this.state.name}
                  onChange={event => this.setState({ name: event.target.value })}
                />
              </div>
            )
          }
          <div className="input-field">
            <input
              placeholder="Email"
              type="text"
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
            />
          </div>
          <div className="input-field">
            <input
              placeholder="Password"
              type="password"
              value={this.state.password}
              onChange={event => this.setState({ password: event.target.value })}
            />
          </div>
          <div className="errors">
            {this.props.errors.map(error => <div key={error}>{error}</div>)}
          </div>
          <button type="submit" className="btn">Submit</button>
        </form>
      </div>
    );
  }
}

export default AuthForm;
