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
      <div>
        <section>
          <h2>People</h2>
          <ul>
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
          <h2>Devices</h2>
          <ul>
            {unknownEntries.map(entry => {
              return (
                <li key={entry.mac}>
                  {entry.mac}
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
