import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
import './List.css';

const ASSOCIATE_URL = 'https://meepo-api.herokuapp.com/associate'

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
    const inputs = event.target.elements
    fetch(ASSOCIATE_URL, {
      method: 'POST',
      body: {
        person: {
          identifier: inputs['person.identifier'].value,
          name: inputs['person.name'].value,
          imageUrl: inputs['person.imageUrl'].value
        },
        device: {
          type: inputs['device.type'].value,
          blacklisted: inputs['device.blacklisted'].value,
          mac: this.state.currentDevice
        }
      }
    })
      .then(() => window.location.reload())
      .catch(() => alert('Erm, something does not work...'))
  }

  sortBy(array, by) {
    return array.sort((a, b) => a[by].localeCompare(b[by]))
  }

  render() {
    const { people, deviceMap } = this.getPeopleAndTheirDevices()
    const unknownEntries = this.getUnknownEntries()

    return (
      <div className="list">
        <section>
          <h4 className="no-margin">
            <i className="fa fa-user" aria-hidden="true"></i>
            <span>{ ` People (${people.length})`}</span>
          </h4>
          <ul className="no-top-margin">
            {this.sortBy(people, 'name').map(person => {
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
            <span>{ ` Guests (${unknownEntries.length})`}</span>
          </h4>
          <ul className="no-top-margin">
            {this.sortBy(unknownEntries, 'ip').map(entry => {
              return (
                <li key={entry.mac}>
                  {this.state.currentDevice === entry.mac &&
                    <form onSubmit={this.handleSubmit.bind(this)} method="post">
                      <table>
                        <tbody>
                          <tr>
                              <td className="third"><div className="input-container"><input type="text" name="person.identifier" placeholder="Unique ID"/></div></td>
                              <td className="third"><div className="input-container"><input type="text" name="person.name" placeholder="Name"/></div></td>
                              <td className="third"><div className="input-container"><input type="text" name="person.imageUrl" placeholder="Image URL"/></div></td>
                          </tr>
                          <tr>
                              <td className="third"><div className="input-container"><input type="radio" name="device.type" value="mobile" defaultChecked/><i className="fa fa-mobile" aria-hidden="true"></i>
                              <input type="radio" name="device.type" value="laptop"/><i className="fa fa-laptop" aria-hidden="true"></i></div></td>
                              <td className="third"><div className="input-container"><input id="checkbox" type="checkbox" name="device.blacklisted"/><label htmlFor="checkbox">Blacklisted?</label></div></td>
                              <td className="third"><div className="input-container"><input type="submit" value="Submit" /></div></td>
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
