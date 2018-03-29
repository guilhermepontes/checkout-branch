#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer')
const git = require('simple-git/promise')()

function validate(summary) {
  const { all, current } = summary

  return (!all || all === 0)
    ? Promise.reject('[branch-checkout] No branches found')
    : { branches: all, current }
}

function parse(summary) {
  const { branches, current } = summary
  return branches.filter(branch => branch !== current)
}

function format(branches) {
  return branches.reduce((list, name) => [...list, { name }], [])
}

function ask(choices) {
  return inquirer.prompt([{
    type: 'list',
    name: 'branch',
    message: '[branch-checkout] Select the branch you want to checkout:',
    choices,
  }])
}

function checkout(answer) {
  const { branch } = answer

  console.log('[branch-checkout] The current branch is now: ' + branch)
  git.checkout(branch)
}

git
  .branchLocal()
  .then(validate)
  .then(parse)
  .then(format)
  .then(ask)
  .then(checkout)
  .catch(console.log)
