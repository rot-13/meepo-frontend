import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
import './List.css';


class List extends Component {
  static PropTypes = {
    entries: PropTypes.array,
    devices: PropTypes.array
  }

  getPeople() {
    return uniqBy(this.props.devices.map(device => device.person), 'identifier')
  }

  getUnknownEntries() {
    const entries = this.props.entries.reduce((unknownEntries, entry) => {
      const knownDevice = this.props.devices.find(device => device.mac === entry.mac || device.blacklisted)
      if (!knownDevice) unknownEntries.push(entry)
      return unknownEntries
    }, [])
    return uniqBy(entries, 'mac')
  }

  render() {
    const people = this.getPeople()
    const unknownEntries = this.getUnknownEntries()

    return (
      <div className="list">
        <section>
          <h4 className="no-margin">
            <i className="fa fa-users" aria-hidden="true"></i>
            <span>&nbsp;People</span>
          </h4>
          <ul className="no-top-margin">
            {people.map(person => {
              return (
                <li key={person.identifier}>
                  {person.name}
                </li>
              )
            })}
          </ul>
        </section>
        <section>
          <h4 className="no-margin">
            <i className="fa fa-mobile" aria-hidden="true"></i>
            <span>&nbsp;Devices</span>
          </h4>
          <ul className="no-top-margin">
            {unknownEntries.map(entry => {
              return (
                <li key={entry.mac}>
                  <table>
                    <tbody>
                      <tr>
                        <td><strong>MAC:</strong></td>
                        <td>{entry.mac}</td>
                      </tr>
                      <tr>
                        <td><strong>IP:</strong></td>
                        <td>{entry.ip}</td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    );
  }
}

export default List;
