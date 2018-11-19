import { plugins, createServer } from 'restify';
import * as router from './routes'
import config from './config';

const server = createServer({
    name    : config.name,
    version : config.version
});

server.use(plugins.acceptParser(server.acceptable));

server.listen(config.port, () => {
    /**
     * Register routes for requests handling
     */
    router.register(server)
    console.log(`Server is listening on port ${config.port}`)
});