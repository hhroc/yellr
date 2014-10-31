# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.provider "virtualbox" do |vb, override|
    override.vm.box = "box-cutter/fedora20"
  end

  config.vm.define "web" do |api|
    api.vm.synced_folder "src/server", "/home/vagrant/server"
    api.vm.network "private_network", ip: "192.168.50.100"
  end

  config.vm.provision "ansible", run: "always" do |ansible|
    ansible.groups = {
      "web" => ["web"],
    }
    ansible.playbook = "vagrant-setup/vagrant.yml"
  end
end
