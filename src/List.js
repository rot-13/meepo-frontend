import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
import './List.css';


class List extends Component {
  static PropTypes = {
    entries: PropTypes.array,
    devices: PropTypes.array
  }

  getPeopleAndTheirDevices() {
    const deviceMap = {}
    const people =  uniqBy(this.props.devices.map(device => {
      const person = device.person
      deviceMap[person.identifier] = Object.assign({}, deviceMap[person.identifier], { [device.type]: true })
      return person
    }), 'identifier')
    return { people, deviceMap }
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
    const { people, deviceMap } = this.getPeopleAndTheirDevices()
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
                  <table>
                    <tbody>
                      <tr>
                        <td><div className="avatar" style={{ backgroundImage: `url(${person.imageUrl})`}}></div></td>
                        <td className="person-name">{person.name}</td>
                        <td className="devices-icons align-right">
                          <span>{deviceMap[person.identifier].mobile &&
                            <i className="fa fa-mobile" aria-hidden="true"></i>
                          }</span>
                        <span>{deviceMap[person.identifier].laptop &&
                            <i className="fa fa-laptop" aria-hidden="true"></i>
                          }</span>
                            </td>
                      </tr>
                    </tbody>
                  </table>
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
                        <td rowSpan={2} className="align-right">
                          <a className="link-me" href="javascript:;">
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                            <span className="hide-in-mobile">&nbsp; Link me!</span>
                          </a>
                        </td>
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
        <section className="copyright">
          Created by Shay Davidson and Elad Shaham
          <br/>
          from the PayPal Consumer Product Center
          <br/>
          © 2017
        </section>
      </div>
    );
  }
}

export default List;
