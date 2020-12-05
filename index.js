import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import crypto from 'crypto';
import http from 'http';

import appSrc from './app.js';
const app = appSrc(express, bodyParser, fs.createReadStream, crypto, http);

app.listen(4321);
