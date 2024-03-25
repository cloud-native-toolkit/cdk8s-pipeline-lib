/* this file is generated during the npx projen build process */
import { ParameterBuilder, TaskBuilder, TaskStepBuilder, WorkspaceBuilder } from 'cdk8s-pipelines';
import { Construct } from 'constructs';
export class CreateExternalSecrets01 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('create-external-secret');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('CLUSTER_SECRET_STORE_NAME')
      .withDescription('ClusterSecretStore name')
      .withDefaultValue('')
      .withPiplineParameter('CLUSTER_SECRET_STORE_NAME', ''));
    this.delegate.withStringParam(new ParameterBuilder('TARGET_SECRET_NAME')
      .withDescription('Kubernetes secret name to be created')
      .withDefaultValue('')
      .withPiplineParameter('TARGET_SECRET_NAME', ''));
    this.delegate.withStringParam(new ParameterBuilder('TARGET_SECRET_NAMESPACE')
      .withDescription('Kubernetes namespace to put secret in')
      .withDefaultValue('')
      .withPiplineParameter('TARGET_SECRET_NAMESPACE', ''));
    this.delegate.withStringParam(new ParameterBuilder('SECRET_DATA')
      .withDescription(`ExternalSecrets data, expressed as an array with elements &#x60;- key: username\n  id: 1234&#x60;, e.g.:

SECRET_DATA: |-
  - key: username
    id: 1234
  - key: password
    id: 5789`)
      .withDefaultValue('')
      .withPiplineParameter('SECRET_DATA', ''));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('oc')
      .fromScriptData(`#!/usr/bin/env bash

mkdir ~/tmp && cd ~/tmp

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig

set -e

cat <<EOF > input.yaml
$(params.SECRET_DATA)
EOF

yq '.[] | [{"secretKey": .key, "remoteRef": { "key": .id }}]' input.yaml > spec_data_field.yaml
yq -i '. | {"spec": {"data": . }}' spec_data_field.yaml

yq '.[] | {(.key): "{{ ." + .key + " }}"}' input.yaml > target_template_data_field.yaml
yq -i '. | {"spec": {"target": {"template": {"data": . }}}}' target_template_data_field.yaml

cat spec_data_field.yaml
cat target_template_data_field.yaml

cat <<EOF > external_secret.yaml
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: $(params.TARGET_SECRET_NAME)
  namespace: $(params.TARGET_SECRET_NAMESPACE)
spec: 
  data: []
  refreshInterval: 1h0m0s
  secretStoreRef: 
    name: $(params.CLUSTER_SECRET_STORE_NAME)
    kind: ClusterSecretStore
  target:
    name: $(params.TARGET_SECRET_NAME)
    creationPolicy: Owner
    template:
      engineVersion: v2
      type: Opaque
      data: []
EOF

cat external_secret.yaml
yq -i ".spec.data = \"$spec_data_field\"" -i external_secret.yaml
yq -i ".spec.target.template.data = \"$target_template_data_field\"" -i external_secret.yaml

yq eval-all --inplace 'select(fileIndex == 0) * select(fileIndex == 1) * select(fileIndex == 2)' external_secret.yaml spec_data_field.yaml target_template_data_field.yaml

cat external_secret.yaml

oc apply -f external_secret.yaml

while true; do
  oc get externalsecret.external-secrets.io/$(params.TARGET_SECRET_NAME) -n $(params.TARGET_SECRET_NAMESPACE) -o yaml > obj.yaml

  export num_conditions=$(yq eval '.status.conditions | length' obj.yaml)
  export num_ready_conditions=$(yq eval '.status.conditions | map(select(.status == "True" and .type == "Ready")) | length' obj.yaml)

  # Check if the health status is "Healthy." If so, exit the loop with exit code 0.
  if [ "$num_ready_conditions" -eq "$num_conditions" ]; then
    echo $(yq eval '.status.conditions | .[].message' obj.yaml)
    exit 0
  fi

  echo "ExternalSecret is not healthy yet."
  echo $(yq eval '.status.conditions | .[].message' obj.yaml)
  # Add a delay (e.g., 5 seconds) before the next iteration (optional, adjust as needed)
  sleep 5
done
`)
      .withWorkingDir('')
      .withImage('quay.io/congxdev/ibm-pak-ubi:latest'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class IbmPak01 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('ibm-pak');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('The OpenShift CLI arguments to run')
      .withDefaultValue('oc ibm-pak help')
      .withPiplineParameter('SCRIPT', 'oc ibm-pak help'));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('oc')
      .fromScriptData(`#!/usr/bin/env bash

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withImage('quay.io/congxdev/ibm-pak-ubi:latest'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class IbmPak02 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('ibm-pak-0.2');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('The OpenShift CLI arguments to run')
      .withDefaultValue('oc ibm-pak help')
      .withPiplineParameter('SCRIPT', 'oc ibm-pak help'));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('oc')
      .fromScriptData(`#!/usr/bin/env bash

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withImage('quay.io/ibmtz/ibm-pak-ubi:latest'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class IbmPakApplyCatalogSource01 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('ibm-pak-apply-catalog-source');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('Optional extra scripts')
      .withDefaultValue('oc ibm-pak help')
      .withPiplineParameter('SCRIPT', 'oc ibm-pak help'));
    this.delegate.withStringParam(new ParameterBuilder('CASE_NAME')
      .withDescription('IBM CASE name, from https://github.com/IBM/cloud-pak/tree/master/repo/case')
      .withDefaultValue('')
      .withPiplineParameter('CASE_NAME', ''));
    this.delegate.withStringParam(new ParameterBuilder('CASE_VERSION')
      .withDescription('IBM CASE version, from https://github.com/IBM/cloud-pak/tree/master/repo/case')
      .withDefaultValue('')
      .withPiplineParameter('CASE_VERSION', ''));
    this.delegate.withStringParam(new ParameterBuilder('ARCHITECTURE')
      .withDescription('Optional, specific architecture for intended operator (amd64, ppc64le, s390x). This may not be required if the product supports all architectures. Check with the relevant product documentation.')
      .withDefaultValue('')
      .withPiplineParameter('ARCHITECTURE', ''));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('oc')
      .fromScriptData(`#!/usr/bin/env bash

mkdir ~/tmp-catalogsources
cd ~/tmp-catalogsources

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig

oc ibm-pak get \${CASE_NAME} --version \${CASE_VERSION}

oc ibm-pak generate mirror-manifests \${CASE_NAME} icr.io --version \${CASE_VERSION}

echo "===== Available catalog sources ====="
ls -A1 ~/.ibm-pak/data/mirror/\${CASE_NAME}/\${CASE_VERSION} | grep catalog-sources > catalog-sources-files.txt
cat catalog-sources-files.txt

# if a specific catalog source for the architecture exists, apply that
if [ ! -z "$ARCHITECTURE" ]
then
  echo "Finding specific catalog source for the chosen architecture ($ARCHITECTURE)"
  if ! cat ~/.ibm-pak/data/mirror/\${CASE_NAME}/\${CASE_VERSION}/catalog-sources-linux-\${ARCH}.yaml; then
    echo "Unable to find catalog source for specific architecture"
    exit 1
  else
    cat ~/.ibm-pak/data/mirror/\${CASE_NAME}/\${CASE_VERSION}/catalog-sources.yaml | yq '.metadata.name' | awk '!/---/' > catalog_sources_names.txt
    oc apply -f ~/.ibm-pak/data/mirror/\${CASE_NAME}/\${CASE_VERSION}/catalog-sources-linux-\${ARCH}.yaml
  fi
else
  echo "No architecture chosen. Applying all available catalog sources"
  cat ~/.ibm-pak/data/mirror/\${CASE_NAME}/\${CASE_VERSION}/catalog-sources* | yq '.metadata.name' | awk '!/---/' > catalog_sources_names.txt
  file_names=\`cat catalog-sources-files.txt\`
  for file_name in $file_names; do
    oc apply -f ~/.ibm-pak/data/mirror/\${CASE_NAME}/\${CASE_VERSION}/$file_name
  done
fi

names=\`cat catalog_sources_names.txt\`
echo "===== Catalog sources applied to cluster ====="
echo $names

echo "===== Waiting for catalog sources to be READY ====="
for name in $names; do
  echo "Waiting for $name to be READY"
  until [[ $(oc get CatalogSource $name -n openshift-marketplace -o json | jq '.status.connectionState.lastObservedState') == "\"READY\"" ]]
  do
    sleep 2
  done
  echo "CatalogSource $name is READY"
done

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withImage('quay.io/congxdev/ibm-pak-ubi:latest'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class IbmPakInstallOperator01 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('ibm-pak-install-operator-0.1');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('Optional extra scripts')
      .withDefaultValue('echo " "')
      .withPiplineParameter('SCRIPT', 'echo " "'));
    this.delegate.withStringParam(new ParameterBuilder('CASE_NAME')
      .withDescription('IBM CASE name, from https://github.com/IBM/cloud-pak/tree/master/repo/case')
      .withDefaultValue('')
      .withPiplineParameter('CASE_NAME', ''));
    this.delegate.withStringParam(new ParameterBuilder('CASE_VERSION')
      .withDescription('IBM CASE version, from https://github.com/IBM/cloud-pak/tree/master/repo/case')
      .withDefaultValue('')
      .withPiplineParameter('CASE_VERSION', ''));
    this.delegate.withStringParam(new ParameterBuilder('ARCHITECTURE')
      .withDescription('Optional, specific architecture for intended operator (amd64, ppc64le, s390x). This may not be required if the product supports all architectures. Check with the relevant product documentation.')
      .withDefaultValue('')
      .withPiplineParameter('ARCHITECTURE', ''));
    this.delegate.withStringParam(new ParameterBuilder('CATALOG_NAMESPACE')
      .withDescription('Namespace to add the catalog source')
      .withDefaultValue('openshift-marketplace')
      .withPiplineParameter('CATALOG_NAMESPACE', 'openshift-marketplace'));
    this.delegate.withStringParam(new ParameterBuilder('OPERATOR_NAMESPACE')
      .withDescription('Namespace to add the catalog source')
      .withDefaultValue('openshift-operators')
      .withPiplineParameter('OPERATOR_NAMESPACE', 'openshift-operators'));
    this.delegate.withStringParam(new ParameterBuilder('REGISTRY')
      .withDescription('Kubernetes registry to get operators from')
      .withDefaultValue('icr.io/')
      .withPiplineParameter('REGISTRY', 'icr.io/'));
    this.delegate.withStringParam(new ParameterBuilder('CASE_INVENTORY')
      .withDescription('Inventory to deploy')
      .withDefaultValue('')
      .withPiplineParameter('CASE_INVENTORY', ''));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('oc')
      .fromScriptData(`#!/usr/bin/env bash

mkdir ~/case && cd ~/case

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig

oc ibm-pak get $CASE_NAME --version $CASE_VERSION
oc ibm-pak generate online-manifests $CASE_NAME --version $CASE_VERSION

oc ibm-pak launch $CASE_NAME --version $CASE_VERSION --action install-catalog --inventory $INVENTORY --namespace $OPERATOR_NAMESPACE -r "--registry $REGISTRY"
oc ibm-pak launch $CASE_NAME --version $CASE_VERSION --action install-operator --inventory $INVENTORY --namespace $OPERATOR_NAMESPACE

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withImage('quay.io/congxdev/ibm-pak-ubi:latest'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class IbmcloudSecretsManagerGet01 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('ibmcloud-secrets-manager-get');
    this.delegate.withStringParam(new ParameterBuilder('KEY_ID')
      .withDescription('An IBM Cloud Secrets Manager key ID')
      .withDefaultValue('968d7819-f2c5-7b67-c420-3c6bfd51521e')
      .withPiplineParameter('KEY_ID', '968d7819-f2c5-7b67-c420-3c6bfd51521e'));
    this.delegate.withStringParam(new ParameterBuilder('SECRETS_MANAGER_ENDPOINT_URL')
      .withDescription('An IBM Cloud Secrets Manager instance endpoint URL (https://cloud.ibm.com/apidocs/secrets-manager/secrets-manager-v2#endpoints)')
      .withDefaultValue('https://{instance_ID}.us-south.secrets-manager.appdomain.cloud')
      .withPiplineParameter('SECRETS_MANAGER_ENDPOINT_URL', 'https://{instance_ID}.us-south.secrets-manager.appdomain.cloud'));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('retrieve-key')
      .fromScriptData(`#!/usr/bin/env bash
set -x

# Retrives the IBM Cloud API Key configured in a \`deployer\` cluster
export IBMCLOUD_API_KEY=$(oc get secret ibm-secret -n kube-system -o jsonpath='{.data.apiKey}' | base64 -d)
export AUTH_RESPONSE_JSON=$(curl -s -X POST \
  "https://iam.cloud.ibm.com/identity/token" \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --header 'Accept: application/json' \
  --data-urlencode 'grant_type=urn:ibm:params:oauth:grant-type:apikey' \
  --data-urlencode "apikey=\${IBMCLOUD_API_KEY}")
export ACCESS_TOKEN=$(echo $AUTH_RESPONSE_JSON | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')
export SECRET_JSON=$(curl -s -X GET --location --header "Authorization: Bearer \${ACCESS_TOKEN}" --header "Accept: application/json" "$(params.SECRETS_MANAGER_ENDPOINT_URL)/api/v2/secrets/$(params.KEY_ID)")
export SECRET=$(echo $SECRET_JSON |  grep -o '"payload":"[^"]*' | grep -o '[^"]*$')
printf "\${SECRET}" | tee $(results.secret-value.path)
`)
      .withWorkingDir('')
      .withImage('quay.io/openshift/origin-cli:4.7'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class KustomizeCli01 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('kustomize-cli');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('The OpenShift CLI arguments to run')
      .withDefaultValue('kustomize help')
      .withPiplineParameter('SCRIPT', 'kustomize help'));
    this.delegate.withStringParam(new ParameterBuilder('VERSION')
      .withDescription('The image version to use')
      .withDefaultValue('latest')
      .withPiplineParameter('VERSION', 'latest'));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('kustomize')
      .fromScriptData(`#!/usr/bin/env bash

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withImage('quay.io/wpernath/kustomize-ubi:$(params.VERSION)'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class IbmLakehouseManage01 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('ibm-lakehouse-manage');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('IMAGE_TAG')
      .withDescription('Latest GA build tag for ibm-lakehouse-manage-utils')
      .withDefaultValue('v1.0.3')
      .withPiplineParameter('IMAGE_TAG', 'v1.0.3'));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('Script to run')
      .withDefaultValue('oc help')
      .withPiplineParameter('SCRIPT', 'oc help'));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('ibm-lakehouse-manage')
      .fromScriptData(`#!/usr/bin/env bash

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig && \
cp $(workspaces.kubeconfig-dir.path)/kubeconfig /opt/ansible/.kubeconfig

unset KUBECONFIG

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withArgs(['/usr/local/bin/entrypoint'])
      .withImage('cp.icr.io/cpopen/watsonx-data/ibm-lakehouse-manage-utils:$(params.IMAGE_TAG)'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class ApplyOlmSubscription02 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('apply-olm-subscription-v0.2');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('SUBSCRIPTION')
      .withDescription('OLM Subscription YAML')
      .withDefaultValue(`apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: subscription-name
  namespace: openshift-operators
spec:
  channel: channel
  name: subscription-name
  source: catalog-source-name
  sourceNamespace: openshift-marketplace
`)
      .withPiplineParameter('SUBSCRIPTION', `apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: subscription-name
  namespace: openshift-operators
spec:
  channel: channel
  name: subscription-name
  source: catalog-source-name
  sourceNamespace: openshift-marketplace
`));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('Optional extra scripts')
      .withDefaultValue('')
      .withPiplineParameter('SCRIPT', ''));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('oc')
      .fromScriptData(`#!/usr/bin/env bash

mkdir ~/tmp
cd ~/tmp

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig

function get_csv
{
  name=$1
  namespace=$2
  csv=$(oc get subscriptions.operators.coreos.com $name -n $namespace -o yaml | yq '.status.currentCSV')
  echo $csv
}
shopt -s expand_aliases

echo "===== Applying the following subscription ====="
printf '%s' "$(params.SUBSCRIPTION)" > "./subscription.yaml"
chmod 0755 ./subscription.yaml
cat ./subscription.yaml

subscription_name=$(cat subscription.yaml | yq '.metadata.name')
subscription_namespace=$(cat subscription.yaml | yq '.metadata.namespace')
echo "Subscription name: $subscription_name"
echo "Subscription namespace: $subscription_namespace"

echo "===== Removing $subscription_name in $subscription_namespace if exists ====="
echo "Checking for existing ClusterServiceVersion"
csv=$(get_csv $subscription_name $subscription_namespace)
echo "CSV: $csv"

if [ $csv == "null" ]; then
  echo "ClusterServiceVersion not found. Maybe the subscription is being created. Deleting that subscription."
  oc -n $subscription_namespace delete subscriptions.operators.coreos.com $subscription_name --ignore-not-found=true
else
  echo "Deleting clusterserviceversion and subscription..."
  oc -n $subscription_namespace delete clusterserviceversions.operators.coreos.com $csv --ignore-not-found=true
  oc -n $subscription_namespace delete subscriptions.operators.coreos.com $subscription_name --ignore-not-found=true
fi

echo "===== Installing $subscription_name in $subscription_namespace ====="
oc apply -f subscription.yaml
while true
do
  echo "Waiting for a cluster service version (CSV) for $subscription_name to be created... (wait 10s inbetween checks)"
  csv=$(get_csv $subscription_name $subscription_namespace)
  echo "CSV: $csv"
  if [ $csv != "null" ]; then
    break
  fi
  sleep 10
done

csv=$(get_csv $subscription_name $subscription_namespace)
while true
do
  csv_phase=$(oc get -n $subscription_namespace clusterserviceversions.operators.coreos.com $csv -o yaml | yq '.status.phase')
  if [[ $csv_phase == "Failed" ]]; then
    echo "CSV failed. Subscription failed to be installed."
    exit 1
  elif [[ $csv_phase == "Succeeded" ]]; then
    echo "CSV installed. Subscription installed."
    break
  else
    echo "Waiting for csv $csv to be Successful. Current phase: $csv_phase... (wait 10s inbetween checks)"
  fi
  sleep 10
done

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withImage('quay.io/congxdev/ibm-pak-ubi:latest'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class OpenshiftClient02 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('openshift-client');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('The OpenShift CLI arguments to run')
      .withDefaultValue('oc help')
      .withPiplineParameter('SCRIPT', 'oc help'));
    this.delegate.withStringParam(new ParameterBuilder('VERSION')
      .withDescription('The OpenShift Version to use')
      .withDefaultValue('4.7')
      .withPiplineParameter('VERSION', '4.7'));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('oc')
      .fromScriptData(`#!/usr/bin/env bash

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withImage('quay.io/openshift/origin-cli:$(params.VERSION)'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
export class ApplyOlmSubscription01 extends TaskBuilder {
  delegate: TaskBuilder;
  public constructor(scope: Construct, id: string) {
    super(scope, id);
    this.delegate = new TaskBuilder(scope, id);
    this.delegate.withName('apply-olm-subscription-v0.1');
    this.delegate.withWorkspace(new WorkspaceBuilder('manifest-dir')
      .withName('manifest-dir')
      .withDescription('The workspace which contains kubernetes manifests which we want to apply on the cluster.'));
    this.delegate.withWorkspace(new WorkspaceBuilder('kubeconfig-dir')
      .withName('kubeconfig-dir')
      .withDescription('The workspace which contains the the kubeconfig file if in case we want to run the oc command on another cluster.'));
    this.delegate.withStringParam(new ParameterBuilder('SUBSCRIPTION')
      .withDescription('OLM Subscription YAML')
      .withDefaultValue(`apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: subscription-name
  namespace: openshift-operators
spec:
  channel: channel
  name: subscription-name
  source: catalog-source-name
  sourceNamespace: openshift-marketplace
`)
      .withPiplineParameter('SUBSCRIPTION', `apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: subscription-name
  namespace: openshift-operators
spec:
  channel: channel
  name: subscription-name
  source: catalog-source-name
  sourceNamespace: openshift-marketplace
`));
    this.delegate.withStringParam(new ParameterBuilder('SCRIPT')
      .withDescription('Optional extra scripts')
      .withDefaultValue('')
      .withPiplineParameter('SCRIPT', ''));
    this.delegate.withStep(new TaskStepBuilder()
      .withName('oc')
      .fromScriptData(`#!/usr/bin/env bash

mkdir ~/tmp
cd ~/tmp

[[ "$(workspaces.manifest-dir.bound)" == "true" ]] && \
cd $(workspaces.manifest-dir.path)

[[ "$(workspaces.kubeconfig-dir.bound)" == "true" ]] && \
[[ -f $(workspaces.kubeconfig-dir.path)/kubeconfig ]] && \
export KUBECONFIG=$(workspaces.kubeconfig-dir.path)/kubeconfig

function get_csv
{
  name=$1
  namespace=$2
  csv=$(oc get subscriptions.operators.coreos.com $name -n $namespace -o yaml | yq '.status.currentCSV')
  echo $csv
}
shopt -s expand_aliases

echo "===== Applying the following subscription ====="
printf '%s' "$(params.SUBSCRIPTION)" > "./subscription.yaml"
chmod 0755 ./subscription.yaml
cat ./subscription.yaml

subscription_name=$(cat subscription.yaml | yq '.metadata.name')
subscription_namespace=$(cat subscription.yaml | yq '.metadata.namespace')
echo "Subscription name: $subscription_name"
echo "Subscription namespace: $subscription_namespace"

echo "===== Removing $subscription_name in $subscription_namespace if exists ====="
echo "Checking for existing ClusterServiceVersion"
csv=$(get_csv $subscription_name $subscription_namespace)
echo "CSV: $csv"

if [ $csv == "null" ]; then
  echo "ClusterServiceVersion not found. Maybe the subscription is being created. Deleting that subscription."
  oc -n $subscription_namespace delete subscriptions.operators.coreos.com $subscription_name --ignore-not-found=true
else
  echo "Deleting clusterserviceversion and subscription..."
  oc -n $subscription_namespace delete clusterserviceversions.operators.coreos.com $csv --ignore-not-found=true
  oc -n $subscription_namespace delete subscriptions.operators.coreos.com $subscription_name --ignore-not-found=true
fi

echo "===== Installing $subscription_name in $subscription_namespace ====="
oc apply -f subscription.yaml
while true
do
  echo "Waiting for a cluster service version (CSV) for $subscription_name to be created... (wait 10s inbetween checks)"
  csv=$(get_csv $subscription_name $subscription_namespace)
  echo "CSV: $csv"
  if [ $csv != "null" ]; then
    break
  fi
  sleep 10
done

csv=$(get_csv $subscription_name $subscription_namespace)
while true
do
  csv_phase=$(oc get -n $subscription_namespace clusterserviceversions.operators.coreos.com $csv -o yaml | yq '.status.phase')
  if [[ $csv_phase != "Succeeded" ]]; then
    echo "Waiting for csv $csv to be Successful. Current phase: $csv_phase... (wait 10s inbetween checks)"
  else
    break
  fi
  sleep 10
done
echo "CSV installed. Subscription installed."

$(params.SCRIPT)
`)
      .withWorkingDir('')
      .withImage('quay.io/congxdev/ibm-pak-ubi:latest'));
  }

  public buildTask(): void {
    this.delegate.buildTask();
  }
}
