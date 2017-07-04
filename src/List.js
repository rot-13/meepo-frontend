import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
import sortBy from 'lodash.sortBy';
import './List.css';


class List extends Component {
  static PropTypes = {
    entries: PropTypes.array,
    devices: PropTypes.array
  }

  constructor(props) {
    super(props)
    this.state = {
      currentDevice: undefined
    }
  }

  getPeopleAndTheirDevices() {
    const deviceMap = {}
    const people =  uniqBy(this.props.devices.reduce((people, device) => {
      const matchingDevice = this.props.entries.find(entry => entry.mac === device.mac && !device.blacklisted)
      if (matchingDevice) {
        const person = device.person
        deviceMap[person.identifier] = Object.assign({}, deviceMap[person.identifier], { [device.type]: true })
        people.push(person)
      }
      return people
    }, []), 'identifier')
    return { people, deviceMap }
  }

  getUnknownEntries() {
    const entries = this.props.entries.reduce((unknownEntries, entry) => {
      const knownDevice = this.props.devices.find(device => device.mac === entry.mac)
      if (!knownDevice) unknownEntries.push(entry)
      return unknownEntries
    }, [])
    return uniqBy(entries, 'mac')
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('erm')
  }

  render() {
    const { people, deviceMap } = this.getPeopleAndTheirDevices()
    const unknownEntries = this.getUnknownEntries()

    return (
      <div className="list">
        <section>
          <h4 className="no-margin">
            <i className="fa fa-users" aria-hidden="true"></i>
            <span>{ ` People ${unknownEntries.count}`}</span>
          </h4>
          <ul className="no-top-margin">
            {sortBy(people, 'name').map(person => {
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
            <span>{ ` Unknown Devices ${unknownEntries.count}`}</span>
          </h4>
          <ul className="no-top-margin">
            {sortBy(unknownEntries, 'mac').map(entry => {
              return (
                <li key={entry.mac}>
                  {this.state.currentDevice === entry.mac &&
                    <form onSubmit={this.handleSubmit} action="https://meepo-api.herokuapp.com/associate" method="post">
                      <table>
                        <tbody>
                          <tr>
                              <td><input type="hidden" name="device[mac]" value={entry.mac}/><input type="text" name="perosn[identifier]" placeholder="Unique ID"/></td>
                              <td><input type="text" name="perosn[name]" placeholder="Name"/></td>
                              <td><input type="text" name="perosn[imageUrl]" placeholder="Image URL"/></td>
                          </tr>
                          <tr>
                              <td><input type="radio" name="device[type]" value="mobile" defaultChecked/><i className="fa fa-mobile" aria-hidden="true"></i>
                              <input type="radio" name="device[type]" value="laptop"/><i className="fa fa-laptop" aria-hidden="true"></i></td>
                              <td><input id="checkbox" type="checkbox" name="device[blacklisted]"/><label htmlFor="checkbox">Blacklisted?</label></td>
                              <td><input type="submit" value="Submit" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </form>
                  }
                  <table>
                    <tbody>
                      <tr>
                        <td><strong>MAC:</strong></td>
                        <td>{entry.mac}</td>
                        <td rowSpan={2} className="align-right">
                          <a className={`link-me ${this.state.currentDevice === entry.mac && 'hidden'}`} onClick={() => {
                              this.setState({ currentDevice: entry.mac })
                            }}>
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                            <span className={`hide-in-mobile`}>{this.state.currentDevice === entry.mac ? " Submit" : " Link me!"}</span>
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
          Created by Shay Davidson, Elad Shaham and Erez Dickman
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
