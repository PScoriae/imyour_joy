pipeline {
    environment {
        imageName = "imyourjoy"
        tz = "Asia/Kuala_Lumpur"
    }

    agent any
    
    stages {
        stage("Build") {
            steps {
                echo "Transpiling then building container..."
                configFileProvider([configFile(fileId: "fa4175e8-7ba6-470e-8139-7d6a8c020f48", targetLocation: 'config.json')]) {
                    sh 'sudo ./build_ts.sh'
                    sh 'sudo docker build --build-arg tz=${tz} -t ${imageName} .'
                }
                echo "Container build complete."
            }
        }
        stage("Clear Existing Container") {
            steps {
                echo "Stopping and removing existing container..."
                sh 'sudo docker stop ${imageName}'
                sh 'sudo docker rm ${imageName}'
                echo "Clearing complete."
            }
        }
        stage("Deploy") {
            steps {
                echo "Running new container..."
                sh 'sudo podman run -d --restart unless-stopped --name ${imageName} ${imageName}'
                echo "New container is running."
            }
        }
        stage("Cleanup") {
            steps {
                echo "Cleaning up..."
                sh 'sudo docker system prune -f'
                echo "Done cleaning up."
            }
        }
    }
}