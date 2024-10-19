import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import articleRouter from './routes/articleRoutes.js';
import calendarRouter from './routes/calendarRoutes.js';
import defaultRouter from './routes/defaultRoutes.js';
import issueMapRouter from './routes/issueMapRoutes.js';
import photoRouter from './routes/photoRoutes.js';
import photoTagRouter from './routes/photoTagRoutes.js';
import userRouter from './routes/userRoutes.js';

/**
 * This file controls the Fastify server and
 * sets up the necessary plugins and routes
 * for the server to function.
 */

const fastify = Fastify();


// Register middleware plugins
fastify.register(fastifyCors);
fastify.register(fastifyHelmet);
fastify.register(fastifyCookie);
fastify.register(fastifyFormbody); // Handles form body parsing


// Register routes
fastify.register(defaultRouter, { prefix: '/' });
fastify.register(articleRouter, { prefix: '/articles' });
fastify.register(calendarRouter, { prefix: '/calendar' });
fastify.register(issueMapRouter, { prefix: '/issue-map' });
fastify.register(photoRouter, { prefix: '/photo' });
fastify.register(photoTagRouter, { prefix: '/photo-tag' });
fastify.register(userRouter, { prefix: '/user' });

export default fastify;
