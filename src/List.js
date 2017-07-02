import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
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
                  {this.state.currentDevice === entry.mac &&
                    <form action="https://meepo-api.herokuapp.com/associate" method="post">
                      <table>
                        <tbody>
                          <tr>
                              <input type="hidden" name="device[mac]" value={entry.mac}/>
                              <td><input type="text" name="perosn[identifier]" placeholder="Unique ID"/></td>
                              <td><input type="text" name="perosn[name]" placeholder="Name"/></td>
                              <td><input type="text" name="perosn[imageUrl]" placeholder="Image URL"/></td>
                              <td><input type="radio" name="device[type]" value="mobile" checked/><i className="fa fa-mobile" aria-hidden="true"></i></td>
                              <td><input type="radio" name="device[type]" value="laptop"/><i className="fa fa-laptop" aria-hidden="true"></i></td>
                              <td><label id="checkbox">Blacklisted?</label><input id="checkbox" type="checkbox" name="device[blacklisted]"/></td>
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
                          <a className={`link-me ${this.state.currentDevice === entry.mac && 'colored'}`} href="javascript:;" onClick={() => {
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
