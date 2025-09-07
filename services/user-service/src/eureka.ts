import { Eureka } from 'eureka-js-client';
import { config } from '@/config';

const eurekaClient = new Eureka({
  instance: {
    app: config.EUREKA_SERVICE_NAME,
    hostName: config.GRPC_HOST,
    ipAddr: config.GRPC_HOST,
    port: {
      $: config.GRPC_PORT,
      '@enabled': true
    },
    vipAddress: 'user-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    },
    leaseInfo: {
      renewalIntervalInSecs: 10,
      durationInSecs: 30
    }
  },
  eureka: {
    host: config.EUREKA_HOST,
    port: config.EUREKA_PORT,
    servicePath: '/eureka/apps/',
    registerWithEureka: true,
    fetchRegistry: true,
    maxRetries: 10,
    requestRetryDelay: 2000
  }
});

export default eurekaClient;
