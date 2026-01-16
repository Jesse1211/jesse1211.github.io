My personal website front-end

to run locally: 
- `pnpm install`
- `pnpm run dev`

to run in docker:
- `docker build -t my-website-spa:local .`: build image with tag 'local' by using '.' - current directory
- `docker run --rm -p 5100:5100 my-website-spa:local`: run

## in kind

load
- `kind load docker-image imgName:imgTag --name my-cluster`
- `kubectl apply -f k8s/fileName.yaml`

connect through LB
- `go install sigs.k8s.io/cloud-provider-kind@latest`
- `sudo cloud-provider-kind`
- `kubectl apply -f k8s/loadbalancer.yaml`