import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import m from 'mongoose';

import UserModel from './models/Users.js';

import appSrc from './app.js';

const User = UserModel(m);
const app = appSrc(express, bodyParser, fs.createReadStream, crypto, http, m, User);

app.listen(4321);
