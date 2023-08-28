[![build](https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib/actions/workflows/build.yml/badge.svg)](https://github.com/cloud-native-toolkit/cdk8s-pipelines-lib/actions/workflows/build.yml)

# Pipeline Library of cdk8s Constructs

This is a library of several "pattern" pipelines that are intended to be
basic and therefore easily reusable.


# To use Tekton Hub Task(s)

The following is an example chart that uses a Tekton Hub Task.

```ts
import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { PipelineBuilder, PipelineTaskBuilder } from 'cdk8s-pipelines';
import { git_cli } from 'cdk8s-pipelines-lib';

export class TektonHubTaskChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);
    new PipelineTaskBuilder();
    new PipelineBuilder(this, 'my-pipeline')
    .withName('clone-build-push')
    .withDescription('This pipeline closes a repository, builds a Docker image, etc.')
    .withTask(git_cli)
    .buildPipeline();
  }
}
const app = new App();
new TektonHubTaskChart(app, 'test');
app.synth()
```
# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### AWSCDKPipelineChart <a name="AWSCDKPipelineChart" id="cdk8s-pipelines-lib.AWSCDKPipelineChart"></a>

The chart for creating a Tekton Pipeline that will use an AWS CDK project to create resources in AWS for re-usable artifacts.

#### Initializers <a name="Initializers" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.Initializer"></a>

```typescript
import { AWSCDKPipelineChart } from 'cdk8s-pipelines-lib'

new AWSCDKPipelineChart(scope: Construct, id: string, props?: AWSCDKPipelineChartProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.Initializer.parameter.props">props</a></code> | <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChartProps">AWSCDKPipelineChartProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk8s-pipelines-lib.AWSCDKPipelineChartProps">AWSCDKPipelineChartProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.addDependency">addDependency</a></code> | Create a dependency between this Chart and other constructs. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.generateObjectName">generateObjectName</a></code> | Generates a app-unique name for an object given it's construct node path. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.toJson">toJson</a></code> | Renders this chart to a set of Kubernetes JSON resources. |

---

##### `toString` <a name="toString" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addDependency` <a name="addDependency" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.addDependency"></a>

```typescript
public addDependency(dependencies: IConstruct): void
```

Create a dependency between this Chart and other constructs.

These can be other ApiObjects, Charts, or custom.

###### `dependencies`<sup>Required</sup> <a name="dependencies" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.addDependency.parameter.dependencies"></a>

- *Type:* constructs.IConstruct

the dependencies to add.

---

##### `generateObjectName` <a name="generateObjectName" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.generateObjectName"></a>

```typescript
public generateObjectName(apiObject: ApiObject): string
```

Generates a app-unique name for an object given it's construct node path.

Different resource types may have different constraints on names
(`metadata.name`). The previous version of the name generator was
compatible with DNS_SUBDOMAIN but not with DNS_LABEL.

For example, `Deployment` names must comply with DNS_SUBDOMAIN while
`Service` names must comply with DNS_LABEL.

Since there is no formal specification for this, the default name
generation scheme for kubernetes objects in cdk8s was changed to DNS_LABEL,
since it’s the common denominator for all kubernetes resources
(supposedly).

You can override this method if you wish to customize object names at the
chart level.

###### `apiObject`<sup>Required</sup> <a name="apiObject" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.generateObjectName.parameter.apiObject"></a>

- *Type:* cdk8s.ApiObject

The API object to generate a name for.

---

##### `toJson` <a name="toJson" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.toJson"></a>

```typescript
public toJson(): any[]
```

Renders this chart to a set of Kubernetes JSON resources.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.isChart">isChart</a></code> | Return whether the given object is a Chart. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.of">of</a></code> | Finds the chart in which a node is defined. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.isConstruct"></a>

```typescript
import { AWSCDKPipelineChart } from 'cdk8s-pipelines-lib'

AWSCDKPipelineChart.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isChart` <a name="isChart" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.isChart"></a>

```typescript
import { AWSCDKPipelineChart } from 'cdk8s-pipelines-lib'

AWSCDKPipelineChart.isChart(x: any)
```

Return whether the given object is a Chart.

We do attribute detection since we can't reliably use 'instanceof'.

###### `x`<sup>Required</sup> <a name="x" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.isChart.parameter.x"></a>

- *Type:* any

---

##### `of` <a name="of" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.of"></a>

```typescript
import { AWSCDKPipelineChart } from 'cdk8s-pipelines-lib'

AWSCDKPipelineChart.of(c: IConstruct)
```

Finds the chart in which a node is defined.

###### `c`<sup>Required</sup> <a name="c" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.of.parameter.c"></a>

- *Type:* constructs.IConstruct

a construct node.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.property.labels">labels</a></code> | <code>{[ key: string ]: string}</code> | Labels applied to all resources in this chart. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChart.property.namespace">namespace</a></code> | <code>string</code> | The default namespace for all objects in this chart. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `labels`<sup>Required</sup> <a name="labels" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.property.labels"></a>

```typescript
public readonly labels: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Labels applied to all resources in this chart.

This is an immutable copy.

---

##### `namespace`<sup>Optional</sup> <a name="namespace" id="cdk8s-pipelines-lib.AWSCDKPipelineChart.property.namespace"></a>

```typescript
public readonly namespace: string;
```

- *Type:* string

The default namespace for all objects in this chart.

---


## Structs <a name="Structs" id="Structs"></a>

### AWSCDKPipelineChartProps <a name="AWSCDKPipelineChartProps" id="cdk8s-pipelines-lib.AWSCDKPipelineChartProps"></a>

Initialization properties for the AWSCDKPipelineChart.

#### Initializer <a name="Initializer" id="cdk8s-pipelines-lib.AWSCDKPipelineChartProps.Initializer"></a>

```typescript
import { AWSCDKPipelineChartProps } from 'cdk8s-pipelines-lib'

const aWSCDKPipelineChartProps: AWSCDKPipelineChartProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChartProps.property.disableResourceNameHashes">disableResourceNameHashes</a></code> | <code>boolean</code> | The autogenerated resource name by default is suffixed with a stable hash of the construct path. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChartProps.property.labels">labels</a></code> | <code>{[ key: string ]: string}</code> | Labels to apply to all resources in this chart. |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChartProps.property.namespace">namespace</a></code> | <code>string</code> | The default namespace for all objects defined in this chart (directly or indirectly). |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipelineChartProps.property.params">params</a></code> | <code>string[]</code> | *No description.* |

---

##### `disableResourceNameHashes`<sup>Optional</sup> <a name="disableResourceNameHashes" id="cdk8s-pipelines-lib.AWSCDKPipelineChartProps.property.disableResourceNameHashes"></a>

```typescript
public readonly disableResourceNameHashes: boolean;
```

- *Type:* boolean
- *Default:* false

The autogenerated resource name by default is suffixed with a stable hash of the construct path.

Setting this property to true drops the hash suffix.

---

##### `labels`<sup>Optional</sup> <a name="labels" id="cdk8s-pipelines-lib.AWSCDKPipelineChartProps.property.labels"></a>

```typescript
public readonly labels: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* no common labels

Labels to apply to all resources in this chart.

---

##### `namespace`<sup>Optional</sup> <a name="namespace" id="cdk8s-pipelines-lib.AWSCDKPipelineChartProps.property.namespace"></a>

```typescript
public readonly namespace: string;
```

- *Type:* string
- *Default:* no namespace is synthesized (usually this implies "default")

The default namespace for all objects defined in this chart (directly or indirectly).

This namespace will only apply to objects that don't have a
`namespace` explicitly defined for them.

---

##### `params`<sup>Optional</sup> <a name="params" id="cdk8s-pipelines-lib.AWSCDKPipelineChartProps.property.params"></a>

```typescript
public readonly params: string[];
```

- *Type:* string[]

---

### GitRepoConfig <a name="GitRepoConfig" id="cdk8s-pipelines-lib.GitRepoConfig"></a>

Contains the information for the GitHub repo and the stack so we can go get it and generate the AWS CDK pipeline.

#### Initializer <a name="Initializer" id="cdk8s-pipelines-lib.GitRepoConfig.Initializer"></a>

```typescript
import { GitRepoConfig } from 'cdk8s-pipelines-lib'

const gitRepoConfig: GitRepoConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk8s-pipelines-lib.GitRepoConfig.property.ghUrl">ghUrl</a></code> | <code>string</code> | The URL for the GitHub or GHE API. |
| <code><a href="#cdk8s-pipelines-lib.GitRepoConfig.property.owner">owner</a></code> | <code>string</code> | The owner of the GitHub repository. |
| <code><a href="#cdk8s-pipelines-lib.GitRepoConfig.property.release">release</a></code> | <code>string</code> | The release tag for the release in which the AWS CDK template should be found. |
| <code><a href="#cdk8s-pipelines-lib.GitRepoConfig.property.repo">repo</a></code> | <code>string</code> | The name of the repository. |
| <code><a href="#cdk8s-pipelines-lib.GitRepoConfig.property.stackName">stackName</a></code> | <code>string</code> | The name of the AWS CDK stack. |
| <code><a href="#cdk8s-pipelines-lib.GitRepoConfig.property.token">token</a></code> | <code>string</code> | The personal access token (PAT) for accessing the library in GitHub. |

---

##### `ghUrl`<sup>Optional</sup> <a name="ghUrl" id="cdk8s-pipelines-lib.GitRepoConfig.property.ghUrl"></a>

```typescript
public readonly ghUrl: string;
```

- *Type:* string

The URL for the GitHub or GHE API.

The value should look like https://api.github.com or
https://github.mycompany.com/api/v3.

---

##### `owner`<sup>Optional</sup> <a name="owner" id="cdk8s-pipelines-lib.GitRepoConfig.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* string

The owner of the GitHub repository.

---

##### `release`<sup>Optional</sup> <a name="release" id="cdk8s-pipelines-lib.GitRepoConfig.property.release"></a>

```typescript
public readonly release: string;
```

- *Type:* string

The release tag for the release in which the AWS CDK template should be found.

---

##### `repo`<sup>Optional</sup> <a name="repo" id="cdk8s-pipelines-lib.GitRepoConfig.property.repo"></a>

```typescript
public readonly repo: string;
```

- *Type:* string

The name of the repository.

---

##### `stackName`<sup>Optional</sup> <a name="stackName" id="cdk8s-pipelines-lib.GitRepoConfig.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string

The name of the AWS CDK stack.

This should be a generated template that is included
in the release.

---

##### `token`<sup>Optional</sup> <a name="token" id="cdk8s-pipelines-lib.GitRepoConfig.property.token"></a>

```typescript
public readonly token: string;
```

- *Type:* string

The personal access token (PAT) for accessing the library in GitHub.

---

## Classes <a name="Classes" id="Classes"></a>

### AWSCDKPipeline <a name="AWSCDKPipeline" id="cdk8s-pipelines-lib.AWSCDKPipeline"></a>

Creator for the AWSCDKPipelineChart.

#### Initializers <a name="Initializers" id="cdk8s-pipelines-lib.AWSCDKPipeline.Initializer"></a>

```typescript
import { AWSCDKPipeline } from 'cdk8s-pipelines-lib'

new AWSCDKPipeline()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk8s-pipelines-lib.AWSCDKPipeline.createFrom">createFrom</a></code> | Generates the AWS CDK Pipeline (AWSCDKPipelineChart) based on the actual project located in GitHub and specified by the configuration. |

---

##### `createFrom` <a name="createFrom" id="cdk8s-pipelines-lib.AWSCDKPipeline.createFrom"></a>

```typescript
import { AWSCDKPipeline } from 'cdk8s-pipelines-lib'

AWSCDKPipeline.createFrom(config: GitRepoConfig)
```

Generates the AWS CDK Pipeline (AWSCDKPipelineChart) based on the actual project located in GitHub and specified by the configuration.

###### `config`<sup>Required</sup> <a name="config" id="cdk8s-pipelines-lib.AWSCDKPipeline.createFrom.parameter.config"></a>

- *Type:* <a href="#cdk8s-pipelines-lib.GitRepoConfig">GitRepoConfig</a>

---




