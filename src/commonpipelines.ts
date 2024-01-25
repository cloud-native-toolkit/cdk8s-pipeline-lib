import { BuilderOptions, DefaultBuilderOptions, PipelineBuilder } from 'cdk8s-pipelines';
import { Construct } from 'constructs';
import { CreateNamespace, CreateOperatorGroup, RegisterIBMOperatorCatalog, Subscribe } from './commontasks';

/**
 * A basic pipeline that starts with a subscription to the IBM operator catalog.
 */
export class InstallFromIBMOperatorPipeline extends PipelineBuilder {

  /**
   *
   * @param scope
   * @param id
   */
  public constructor(scope: Construct, id: string, ns: string, name: string) {
    super(scope, id);
    const labels = {};
    super.withTask(CreateNamespace(scope, 'create-namespace', ns));
    super.withTask(RegisterIBMOperatorCatalog(scope, 'register-ibm-operators', labels, 45));
    super.withTask(CreateOperatorGroup(scope, 'create-operator-group', ns, `${name}-operator-group`));
    super.withTask(Subscribe(scope, 'subscribe', ns, name, 'ibm-operator-catalog'));
  }

  /**
   *
   * @param opts
   */
  public buildPipeline(opts: BuilderOptions = DefaultBuilderOptions): void {
    // Add the
    super.buildPipeline(opts);
  }
}