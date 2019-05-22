import { ModuleService } from '../service/module.service';
export declare const createModuleHook: (moduleService: ModuleService) => <T = any>(key: string) => [T, Promise<T>];
