import React, { Component } from 'react'
import { List, ListItem, ListItemText, Collapse, Drawer } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { Link, Router, Route, Switch } from 'react-router-dom'
import menuItems from './menuItems'
import { createBrowserHistory } from "history";
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'

const customHistory = createBrowserHistory();

class MenuBar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  // this method sets the current state of a menu item i.e whether it is in expanded or collapsed or a collapsed state
  handleClick(item) {
    this.setState(prevState => (
      { [item]: !prevState[item] }
    ))
  }
  // if the menu item doesn't have any child, this method simply returns a clickable menu item that redirects to any location and if there is no child this method uses recursion to go until the last level of children and then returns the item by the first condition.
  render() {
    const { classes } = this.props
    return (
      <div>
        <Drawer
          variant="persistent"
          anchor="left"
          open>
          <div>
            <List>
              <ListItem
                key="menuHeading"
                divider
                disableGutters
              >
                <ListItemText
                  className={classes.menuHeader}
                  inset
                  primary="Menu"
                />
              </ListItem>
              
            </List>
          </div>
        </Drawer>
      </div>
    )
  }
}
export default MenuBar