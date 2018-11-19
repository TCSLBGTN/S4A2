node('DockerNode'){
    
    stage('SCM App Code Checkout'){
        git 'https://github.com/tcslbgtechninja/S4A2'
    }
    
    stage('Build Docker Image'){
        sh 'sudo docker build -t tcslbgtechninja/S4A2:1.0.0 .'
    }
    
    stage('Push Docker Image'){
        withCredentials([string(credentialsId: 'dockerHubPassword', variable: 'dockerHubPassword')]) {
            sh "sudo docker login -u techninjas4 -p ${dockerHubPassword}"
        }
        sh 'sudo docker push tcslbgtechninja/S4A2:1.0.0'
    }
    
    stage('Remove Old Containers'){
        def containerIDs = sh(script: "sudo docker ps -f \"label=S4A2\" -q", returnStdout: true).trim()
        if(!containerIDs.isEmpty()){
            sh 'sudo docker stop $(sudo docker ps -f \"label=S4A2\" -q)'
            sh 'sudo docker rm $(sudo docker ps -a -f \"label=S4A2\" -q)'
        }
    }
    
    stage('Deploy New Containers'){
        sh 'sudo docker run -d -p 5001:3001 --label "S4A2" tcslbgtechninja/S4A2:1.0.0'
        sh 'sudo docker run -d -p 5002:3001 --label "S4A2" tcslbgtechninja/S4A2:1.0.0'
        sh 'sudo docker run -d -p 5003:3001 --label "S4A2" tcslbgtechninja/S4A2:1.0.0'
        sh 'sudo docker run -d -p 5004:3001 --label "S4A2" tcslbgtechninja/S4A2:1.0.0'
        sh 'sudo docker run -d -p 5005:3001 --label "S4A2" tcslbgtechninja/S4A2:1.0.0'
    }
    
    stage('List of Containers'){
        sh 'sudo docker ps'
    }
     
}
